import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'
import db from "../config/db";
import baseResult from '../model/baseResult'

@AutoWritedUser
class UserService extends BaseService{
    constructor(){
        super(UserService.model)
    }
    checkBeforeCreate(attr) {
        if (attr.robot_ind === true) {
            return {code:403,msg:"system does not accept robot."}
           // return new baseResult(403,"system does not accept robot.")
        }

        var sql = "select count(u.user_id) cnt from  t_user u  where u.user_name = :user_name";
        return db.query(sql,{replacements:{user_name:attr.user_name},type:db.QueryTypes.SELECT}).then(result =>{
            if (result && result[0].cnt >0 ) {
                return {code:400,msg:"user name already taken."};
            }else {
                return null;
            }
        });

    }
    login(attr,res) {
        return this.baseFindByFilter(null,{user_name:attr.username,password:attr.password});
    }
    getUser(username,password) {
        return this.baseFindByFilter(null,{user_name:username,password:password});
    }
    getById(userId) {
        return this.baseFindByFilter(null,{user_id:userId})
    }
}
module.exports = new UserService()