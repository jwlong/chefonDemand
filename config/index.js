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
    jwtSession: {session: true},
    expiresMinutes:60*1,
    // the WHITE_LIST_URL allow to access system ,but them are not  necessary to authenticate
    WHITE_LIST_URL:["/user/userLogin",'/user/refreshAccessToken',
        "/chef/createChef","/user/createUser",
        "/chef/getChefDetailByChefId",'/menu/getMenuByMenuId','/menu/getMenuServingDetailByMenuId',
        'menu/getMenuKitchenRequirementItems','/menu/getMenuKitchenRequirementByMenuId',
        '/menu/getMenuIncludeItems','/menu/getMenuAboutByMenuId','/menu/getMenuPhotosByMenuId',
        '/menu/getMenuBookingRequirement','menu/getAvailableCuisineTypes',
        '/menu/getMenuCancelPolicy','/menu/getMenuChefNoteByMenuId',
        '/menu/getMenuRatingByMenuId','/menu/getMenuReviewsByMenuId','/menu/getMenuListByPopular',
        '/menu/getMenuListByRating','/menu/getMenuListByChefsChoice','/chef/findChefByFilters','/menu/findMenuByFilters','/menu/getMenuListByChefId'],
    // when robot_ind 为true时，这种情况下插入数据
    robot_id:0,
    sys_user_id:1
}
module.exports = config;
