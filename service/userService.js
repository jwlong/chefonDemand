import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'
import db from "../config/db";
import baseResult from '../model/baseResult'
import accessTokenService from "./accessTokenService";
import userMenuViewService from './useMenuViewService'
import chefMenuService from  './chefMenuService'
import cfg from "../config";
import moment from "moment"
import uuid from 'uuid';
import activeIndStatus from "../model/activeIndStatus";
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
    getById(userId,t) {
        return this.getModel().findOne({where:{user_id:userId,active_ind:activeIndStatus.ACTIVE},transaction:t})
    }
    validPassword(encodedPassword, password) {
        console.log("result passwd:",UserService.model.isPassword(encodedPassword, password));
        return UserService.model.isPassword(encodedPassword, password);
    }

    loginHandler(userLoginParam) {
        return db.transaction(t=> {
            return this.loginAndGenToken(userLoginParam,t);
        })
    }
    loginAndGenToken(userLoginParam,t) {
        return this.getModel().findOne({where:{user_name:userLoginParam.user_name},transaction:t}).then(user => {
            if (user && this.validPassword(user.password,userLoginParam.password)) {

                return accessTokenService.nextId('token_id',{transaction:t}).then(nextId => {
                    let tokenData = {};
                    tokenData.token_id = nextId;
                    tokenData.user_id = user.user_id;
                    tokenData.token_string = uuid.v1();
                    tokenData.refresh_token = uuid.v1();
                    tokenData.for_order = false;
                    tokenData.valid_until = moment().add(cfg.expiresMinutes, 'minutes');
                    tokenData.ipv4_address = userLoginParam.ipv4_address;
                    console.log("will insert into access_token_record:",tokenData);
                    return accessTokenService.baseCreate(tokenData,{transaction:t})
                });
            } else {
                throw baseResult.USER_INVALID_NAME_PASSWD;
            }
        })
    }

    refreshAccessToken(query) {
        return db.transaction(t => {
            return accessTokenService.baseUpdate({active_ind:activeIndStatus.INACTIVE},{where:{refresh_token:query.refresh_token},transaction:t}).then(result => {
                 console.log("update t_access_token count:",result);
                 return this.loginAndGenToken(query,t);
            })
        })
    }
    // logout and insert t_user_menu_view
    userLogout(attrs) {
        return db.transaction(t => {
            return accessTokenService.baseUpdate({active_ind: activeIndStatus.INACTIVE}, {
                where: {
                    user_id: attrs.user_id,
                    active_ind: activeIndStatus.ACTIVE
                }, transaction: t
            }).then(updatedToken => {
                let checkPromiseArr = [];
                attrs.menu_viewed_list.forEach(viewd => {
                    viewd.user_id = attrs.user_id;
                    checkPromiseArr.push(chefMenuService.getOneByMenuId(viewd.menu_id).then(chefMenu => {
                        if (!chefMenu) {
                            throw 'menu_id is not exists!';
                        }
                    }))
                })
                return Promise.all(checkPromiseArr).then(resp => {
                        return userMenuViewService.baseCreateBatch(attrs.menu_viewed_list, {transaction: t});
                    }
                )

            })
        })

    }
}
module.exports = new UserService