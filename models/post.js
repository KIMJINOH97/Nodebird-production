module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'post',
        {
            content: {
                type: DataTypes.STRING(140),
                allowNull: false,
            },
            img: {
                type: DataTypes.STRING(200), // 이미지는 서버에 저장 해두면 이미지에 대한 서버 주소가 생기는데 그 주소를 저장
                allowNull: true,
            },
        },
        { timestamps: true, paranoid: true, charset: 'utf8', collate: 'utf8_general_ci' }
    );
};
