//创建 UserContext  单例
const UserContext= {
    userId:null,
    robot_id:0 // 设置默认的robot ID为0，即是用于当未授权登陆时的更新,或者创建动作
}
module.exports=  UserContext;
