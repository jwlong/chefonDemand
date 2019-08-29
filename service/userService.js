import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'
import db from "../config/db";
import baseResult from '../model/baseResult'
import accessTokenService from "./accessTokenService";
import cfg from "../config";
import moment from "moment"
import uuid from 'uuid';
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

    loginHandler(userLoginParam) {
        return db.transaction(t=> {
           return this.getModel().findOne({where:{user_name:userLoginParam.user_name},transaction:t}).then(user => {
                if (user && this.validPassword(user.password,userLoginParam.password)) {

                    return accessTokenService.nextId('token_id',{transaction:t}).then(nextId => {
                        let tokenData = {};
                        tokenData.token_id = nextId;
                        tokenData.user_id = user.user_id;
                        tokenData.token_string = uuid.v1();
                        tokenData.refresh_token = uuid.v1();
                        tokenData.valid_until = moment().add(cfg.expiresMinutes, 'minutes');
                        tokenData.ipv4_address = userLoginParam.ipv4_address;
                        console.log("will insert into access_token_record:",tokenData);
                        return accessTokenService.baseCreate(tokenData,{transaction:t})
                    });
                } else {
                    throw baseResult.USER_INVALID_NAME_PASSWD;
                }
            })
        })


    }
}
module.exports = new UserService()