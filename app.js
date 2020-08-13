const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet'); // 보안을 위함
const hpp = require('hpp'); // 보안을 위함.
const logger = require('./logger');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const indexRouter = require('./routes/page');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

//const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport); // passport가 돌아가기 시작

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8001);

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet()); // 너무 보안이 쌔긴함.
    app.use(hpp());
} else {
    //development 면 개발
    app.use(morgan('dev')); // 개발모드 설정, 개발과 배포 동시에 되도록 가능하게
}

app.use(express.static(path.join(__dirname, 'public'))); // 여기 기본 주소는 '/'임. 생략가능
app.use('/img', express.static(path.join(__dirname, 'uploads'))); //  /img/abc.png 서버 경로와 프론트 경로는 다름. 해커들이 추적 어렵게.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 밑의 session의 secret와 같게 해주는게 도움 됨
// express session도 바꿔줘야함 (배포용으로 설정)
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    // store: new RedisStore({
    //     host: process.env.REDIS_HOST,
    //     port: process.env.REDIS_PORT,
    //     pass: process.env.REDIS_PASSWORD,
    //     logErrors: true,
    // }),
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true; // 중계? 서버
    sessionOption.cookie.secure = true; // 배포할 땐 https로 씀
}
app.use(session(sessionOption));

app.use(flash());
app.use(passport.initialize()); // 미들웨어도 있음. passport설정 초기화
app.use(passport.session()); // local로 했을 때 사용자 정보를 session에 저장함, express session보단 아래에 있어야함

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello'); // console.info 대체
    logger.error(err.message); // console.error 대체
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});
