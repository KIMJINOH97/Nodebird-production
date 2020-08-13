const express = require('express');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST/auth/join   router.get(미들웨어1, 미들웨어2, 미들웨어3) 차례대로 봄 , isnotloggedin 보면서 거를 수 있음
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.'); // 1회성 메세지
            return res.redirect('/join'); // 있으면 다시 돌려보냄
        }
        console.time('암호화시간');
        const hash = await bcrypt.hash(password, 12); // 암호화를 시킴, 12 > 숫자 커질 수록 암호 가 더 됨
        console.timeEnd();
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST/auth/ login/
router.post('/login', isNotLoggedIn, (req, res, next) => {
    //req.body.email, req.body.password, done(에러, 성공, 실패)  >> (authErr, user, info)=>{}로 전달 된다.
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            // done에서 에러처리 나오면 바로 넘기고
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            // 실패 했을 때
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            // req.user에서 사용자 정보를 찾을 수 있음
            if (loginError) {
                // done에서 성공은 하는데 에러 날 수도 있음.
                console.error(loginError);
                return next(loginError);
            }
            console.log('sisisisiblalbalbalbalbalbal');
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

// GET/auth/logout
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(); // req.user
    // 세션을 지운다 logout시에는 안해도 됨, 다른 세션도 같이 지워지기 때문
    res.redirect('/'); // 메인 페이지로 돌려보냄
});

// (1)
router.get('/kakao', passport.authenticate('kakao')); // 이렇게하면 카카오strategy가 생성됨

// (3)
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
        failureDirect: '/', // 카카오 로그인 실패 했을 때
    }),
    (req, res) => {
        res.redirect('/'); // 성공했을 때
    }
);
module.exports = router;
