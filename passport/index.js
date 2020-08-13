const local = require('./localStrategy'); // strategy 전략 : 누구를 로그인 시킬 것이가 여기는 직접 로그인을 함
const kakao = require('./kakaoStrategy');
const { User } = require('../models');
// 카카오 버튼을 눌러 카카오 로그인 하는데, 카카오쪽에서 코드를 보내주는데 그 사용자가믿을 만한 사용자 라는 것을 보내줌
// const user = []; // 실무에서는 최소한 적게 데이터베이스를 접근하도록 캐싱을 함.

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        // user = { id :1, name : zero, age: 25} 이걸 다 세션에 저장하긴 무거움 유저정보 중 아이디만 세션에 저장(고유값 이므로) -> 1만 저장
        done(null, user.id);
        console.log(user.id);
    });

    // 메모리에 1번만 저장 1-> { id :1, name : zero, age: 25} 이걸로 바꿔줌 req.user
    // 요청이 갈 때마다 매번 호출 됨
    passport.deserializeUser((id, done) => {
        console.log('id = ', id);
        // if (user[id]) {
        //     done(user[id]);
        // } else {
        User.findOne({
            // req.user를 수정하고싶다면 deserializeUser에서 해야함.
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                },
            ],
        })
            .then((user) => done(null, user)) //(user[id] = user), done(null, user) 팔로워를 여기서 넣는다.
            .catch((err) => done(err));
    });
    local(passport);
    kakao(passport);
};
