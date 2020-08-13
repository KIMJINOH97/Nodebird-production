const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

// (2) (4)
module.exports = (passport) => {
    passport.use(
        // 로컬을 넣어줬다면, 이번에는 kakao를 넣어줌
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: 'http://localhost:8001/auth/kakao/callback', // 콜백을 받을 라우터를 지정
            },
            async (accessToken, refreshToken, profile, done) => {
                // async 문이니 try, catch
                try {
                    const exUser = await User.findOne({
                        where: { snsId: profile.id, provider: 'kakao' }, // pfofile 객체에 snsid를 넣어줌
                    });
                    if (exUser) {
                        // 있으면 그대로 고
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            // 카카오가 profile객체에 담아 줌 다른 것들도 추가 할 때 console.log로 profile안에 뭐가 들어있는 지 확인
                            email: profile._json && profile._json.kakao_account.email,
                            nick: profile._json.kakao_account.profile.nickname,
                            snsId: profile.id, // 각 소셜미디어에서 id가 있는데 구별위해 밑의 kakao를 넣어줌
                            provider: 'kakao',
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            } // 응답내용은 local 응답의 이메일 패스워드와 다름
        )
    );
};
// 1. /auth/kako로 요청 보냄 여기서 다시 카카오 인증 서버로 인증을 보냄.
// 2. 카카오 로그인
// 3. /auth/kakao/callback으로 프로필 반환
