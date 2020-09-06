const express = require('express');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const { User } = require('../models');

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } }); // 로그인 한 그 사람을 찾아서
        await user.addFollowing(parseInt(req.params.id, 10)); // 팔로잉 한 사람을 추가한다.'
        // console.log('req.params', req.params);
        // console.log('req.user', req.user.toJSON());
        res.send('sucess');
    } catch (err) {
        console.error(err);
        next(err);
    }
}); // 로그인 한 사람만 가능

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } }); // 로그인 한 그 사람을 찾아서
        await user.removeFollowing(parseInt(req.params.id, 10)); // 팔로우 취소
        res.send('well');
    } catch (err) {
        console.error(err);
        next(err);
    }
}); // 로그인 한 사람만 가능

router.post('/profile', async (req, res, next) => {
    try {
        await User.update(
            { nick: req.body.nick },
            {
                where: { id: req.user.id },
            }
        );
        // console.log('hi');
        // const user = await User.findOne({
        //     where: { id: req.user.id },
        // });
        // user.nick = req.body.nick;
        // await user.save();
        // console.log(user);
        res.redirect('/profile');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
