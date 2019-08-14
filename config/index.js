const config = {
    port:3333,
    host:'127.0.0.1',
    mysql :{
        host:'127.0.0.1',
        database:'chefondemand',
        user: 'root',
        pwd: 'lllongjin'
    },
    jwtSecret: "asdfsafsafsafsafsafsafsafd",
    jwtSession: {session: true},
    WHITE_LIST_URL:["/user/userLogin"]
}
module.exports = config;
