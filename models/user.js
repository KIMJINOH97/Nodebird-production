module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            email: {
                type: DataTypes.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: true, // 카카오 로그인 할 때는 필요 없으므로
                defaultValue: 'Sisisisisibalalal',
            },
            provider: {
                type: DataTypes.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            }, // 만약 provider가 kakao면 kakao를 통해 가입했다 전해주는것이고, local이면 local로 구분
            snsId: {
                type: DataTypes.STRING(30), // 카카오로 했을 때만 알려줌
                allowNull: true,
            },
        },
        { timestamps: true, paranoid: true, charset: 'utf8', collate: 'utf8_general_ci' } // timestamps => 생성일, 수정일 paranoid: 삭제일(복구용)
    );
};
// zero 25 2018-07-20 2018-0728 등
