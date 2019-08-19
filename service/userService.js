import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'
import db from "../config/db";
import baseResult from '../model/baseResult'
@AutoWritedUser
class UserService extends BaseService{
    constructor(){
        super(UserService.model)
    }
    checkBeforeCreate(attr,isValidRobot) {
        console.log("checkBeforeCreate....")
        if (isValidRobot && attr.robot_ind) {
            //return {code:403,msg:"system does not accept robot."}
            throw baseResult.USER_NOT_ACCEPT_ROBOT;
        }
        if (!attr.first_name || !attr.last_name || !attr.email_address || !attr.contact_no) {
            throw baseResult.USER_MANDATORY_FIELD_EXCEPTION;
        }

        var sql = "select count(u.user_id) cnt from  t_user u  where u.user_name = :user_name";
        return db.query(sql,{replacements:{user_name:attr.user_name},type:db.QueryTypes.SELECT}).then(result =>{
            if (result && result[0].cnt >0 ) {
                //return {code:400,msg:"user name already taken."};
                throw baseResult.USER_NAME_ALREADY_TOKEN;
            }else {
                return null;
            }
        });

    }

    login(attr,res) {
        return this.baseFindByFilter(null,{user_name:attr.username});
    }
    getUser(username,password) {
        return this.baseFindByFilter(null,{user_name:username,password:password});
    }
    getById(userId) {
        return this.baseFindByFilter(null,{user_id:userId})
    }
    validPassword(encodedPassword, password) {
        console.log("result passwd:",UserService.model.isPassword(encodedPassword, password));
        return UserService.model.isPassword(encodedPassword, password);
    }
}
module.exports = new UserService()