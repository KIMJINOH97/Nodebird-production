const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

// 프로필 페이지
router.get('/profile', isLoggedIn, async (req, res, next) => {
    // 로그인 한 사람만 들어옴
    res.render('profile', { title: 'profile', user: req.user });
    try {
        const follow = await User.findAll({
            where: { id: req.user.id },
            include: {
                model: User,
                as: 'Followers',
            },
        });
        // console.log(follow);
    } catch (e) {
        console.error(e);
        next(e);
    }
    console.log('/user.tojson()', req.user.toJSON());
});

// 회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res) => {
    // 로그인 안 한 사람만 들어옴

    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

// 메인 페이지
router.get('/', (req, res, next) => {
    Post.findAll({
        // 게시글 작성자 모델과 include로 연결 해주고, 작성자의 id,nick을 가져옴
        include: [
            {
                model: User,
                attributes: ['id', 'nick'],
            },
            {
                // include 에서 같은 모델이 여러개면 as로 가져온다.
                model: User, //좋아요를 누른 사람들을 가져온다.
                attributes: ['id', 'nick'],
                as: 'Liker',
            },
        ],
        // 여러 것을 include 할 때
    })
        .then((posts) => {
            //console.log(posts);
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

module.exports = router;
