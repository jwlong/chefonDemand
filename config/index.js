const config = {
    port:3333,
    host:'127.0.0.1',
    mysql :{
        host:'127.0.0.1',
        database:'chefondemand',
        user: 'root',
        pwd: 'lllongjin'
    },
    //jwt
    jwtSecret: "asdfsafsafsafsafsafsafsafd",
    jwtSession: {session: true},
    expiresIn:'24h',

    // the WHITE_LIST_URL allow to access system ,but them is not  necessary to authenticate
    WHITE_LIST_URL:["/user/userLogin","createChef"],
    // when robot_ind 为true时，这种情况下插入数据，对应的表字段update_by,create_by的操作ID = 0
    robot_id:0
}
module.exports = config;
