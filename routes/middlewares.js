exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.login, req.logout 로그인 여부를 알려줌
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // 로그인을 안 했으면
        next();
    } else {
        res.redirect('/'); // 로그인 했으면
    }
};
