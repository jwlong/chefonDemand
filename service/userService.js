import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'
import db from "../config/db";


@AutoWritedUser
class UserService extends BaseService{
    constructor(){
        super(UserService.model)
    }
    checkBeforeCreate(attr,res) {
        var sql = "select count(u.user_id) from  t_user u  where u.user_name = :user_name";
        let cnt = db.query(sql,{replacements:{user_name:attr.user_name},type:db.QueryTypes.SELECT});
        if (cnt && cnt >0 ) {
            res.status(400).json({msg:'user name already taken.'});
        }
    }
    login(attr,res) {
        return this.baseFindByFilter(null,{user_name:attr.username,password:attr.password});
    }

}
module.exports = new UserService()