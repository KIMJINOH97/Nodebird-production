const express = require('express');
const path = require('path');
const multer = require('multer');
const { Post, Hashtag, User } = require('../models');
const { isLoggendIn, isLoggedIn } = require('./middlewares');
const router = express.Router();

// 이미지 업로드시 폼을 multipart/form-data로, 그리고 이것을 해석하려면 multer가 필요함.
// 왜냐 express.json 과 express.urlencoded가 해석을 못함 그래서 multer필요
// enctype = "multipart/form-data"

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 파일의 확장자 추가하기
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf + ext); // 확장자 제외한 파일명(basename)에다 확장자 붙여줌 시간은(중복방지)
        },
        limit: { fileSize: 5 * 1024 * 1024 },
    }), //서버 디스크에 저장 cb(에러, 결과값)
});
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    // upload.single로 사진의 경로를 알림.
    console.log(req.body, req.file); // multer를 통해 업로드 한 것은 file에 저장되어 있음
    res.json({ url: `/img/${req.file.filename}` }); // 이미지 업로드는 uploads폴더에다 하는데 이미지를 가져 올때는 정적파일에 담겨 있다고 해서 가져옴, 고로 app.js에 정적파일 추가.
});
// single: 이미지하나(필드명)  array: 이미지 여러 개(단일 필드) fields: 이미지 여러 개(여러 필드) none: 이미지 x

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    // 게시글 업로드 중 사진 첨부 안 할 경우
    try {
        console.log(req.user.id);
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id, // 게시글 작성자 > 여러개의 개시글 가짐. 사용자 아이디를 생성 해줘야!
        });
        const hashtags = req.body.content.match(/#[^\s]*/g); // 정규표현식
        if (hashtags) {
            // 안녕하세요 #노드 #익스프레스
            // hashtags = ['#노드, #익스프레스']
            const result = await Promise.all(
                hashtags.map((tag) =>
                    Hashtag.findOrCreate({
                        // DB에 있으면 찾고 없으면 새로 생성
                        where: { title: tag.slice(1).toLowerCase() }, // slice > #노드 에서 #을 지운거임, 대소문자 구별X toLowerCase()
                    })
                )
            );
            await post.addHashtags(result.map((r) => r[0])); // post(게시글) 와 해쉬테그를 이어줌.
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        // 아무것도 입력안 할 경우 기본페이지
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] }); // hashtag 가 4이다. 4번에 해당하는 hashtag다 가져옴 User정보도 가져옴.
            // 다대 다 관계에서 getPosts 만으로 다 가져 올 수 있다.
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts, // 검색 결과들을 twit에 넣어준다.
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    // A.getB: 관계있는 low 조회 A.addB: 관계 생성 A.setB: 관계 수정  A.removeB: 관계 제거
});
module.exports = router;
