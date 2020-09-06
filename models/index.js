const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 다대 다 관계 이해 <hashtag>
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post); // 사용자 1명이 게시글을 많이 가지고있다 라 해석하면 됨.
db.Post.belongsTo(db.User);

db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
// 다대다 관계에서는 새로운 테이블(모델)이 생긴다.

db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });

db.User.belongsToMany(db.Post, { through: 'Like' }); // 사용자와 게시글 간에 다대 다 관계가 됨
db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker' });
// 다대다 관계

// 1. 제로
// 2. 네로
// 3. 히어로
// 4. 바보

// 일반인 - 유명인
// 1-2
// 1-3
// 2-3
// 3-1
// 1-4

// 1. 제로
// 2. 네로
// 3. 히어로
// 4. 바보

module.exports = db;

// 1. 안녕하세요. #노드 #익스프레스
// 2. 안녕하세요. #노드 #제이드
// 3. 안녕하세요. #노드 #퍼그

// 1-1 관계가 있음
// 1-2 관계가 있음

// 2-1
// 2-3

// 3-3
// 3-4

// 1. 노드
// 2. 익스프레스
// 3. 제이드
// 4. 퍼그
