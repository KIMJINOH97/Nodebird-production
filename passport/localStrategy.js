const Localstrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = (passport) => {
    passport.use(
        new Localstrategy(
            {
                usernameField: 'email', // req.body.email 를 뜻함
                passwordField: 'password', // req.body.password 를 뜻함
            },
            async (email, password, done) => {
                // 콜백으로 성공햇을 때 뭐 할 지 이어짐. 흐름을 기억
                // done(에러, 성공, 실패)
                try {
                    const exUser = await User.findOne({ where: { email } }); // 이메일이 있는 지 검사를 함
                    if (exUser) {
                        // 비밀번호 검사
                        const result = await bcrypt.compare(password, exUser.password); // 비밀번호를 비교할 수 있음 사용자 입력 and db에 저장된 것이랑 비교
                        if (result) {
                            console.log('로그인 성공이요~');
                            done(null, exUser);
                        } else {
                            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                        }
                    } else {
                        done(null, false, { message: '가입되지 않은 회원입니다. ' }); // 실패 한 것
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
// done(서버에러), done(null, 사용자 정보), done(null, false, 실패 정보)
// urlencoded 미들웨어가 해석한 req.body의 값들을 usernameField, passwordField에 연결함.
