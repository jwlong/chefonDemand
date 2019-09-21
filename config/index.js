const config = {
    port:3333,
    host:'127.0.0.1',
    mysql :{
        host:'127.0.0.1',
        database:'chefondemand',
        user: 'root',
        pwd: 'lllongjin',
        port:3306
    },
    //jwt
    jwtSecret: "asdfsafsafsafsafsafsafsafd",
    jwtSession: {session: true},
    expiresMinutes:60*2,
    // the WHITE_LIST_URL allow to access system ,but them are not  necessary to authenticate
    WHITE_LIST_URL:["/user/userLogin","/chef/createChef","/user/createUser","/chef/getChefDetailByChefId",'/menu/getMenuByMenuId','/menu/getMenuServingDetailByMenuId','menu/getMenuKitchenRequirementItems','/menu/getMenuKitchenRequirementByMenuId','/menu/getMenuIncludeItems','/menu/getMenuAboutByMenuId'],
    // when robot_ind 为true时，这种情况下插入数据
    robot_id:0
}
module.exports = config;
