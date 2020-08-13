const express = require('express');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const { User } = require('../models');

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } }); // 로그인 한 그 사람을 찾아서
        await user.addFollowing(parseInt(req.params.id, 10)); // 팔로잉 한 사람을 추가한다.'
        res.send('sucess');
    } catch (err) {
        console.error(err);
        next(err);
    }
}); // 로그인 한 사람만 가능

module.exports = router;
