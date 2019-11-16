/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';
import cfg from '../config/index'
import baseResult from "../model/baseResult";
import utils from "../common/utils";

const router = express.Router()
// 请求前缀为/user
class UserController {
    static initRouter(){
        /***************User 业务***************/
        router.post('/createUser',  async(req, res,next) => {
            var data  = req.body;
            try {
                await userService.checkBeforeCreate(req.body,res);
               try {
                   let user = req.body;
                   try {
                       if (!user.user_name || !user.password) {
                           throw baseResult.USER_INVALID_NAME_PASSWD;
                       }
                       user.user_id = await  userService.nextId('user_id');
                       user.update_by = req.user_id || cfg.robot_id;
                       user.ipv4_address = user.IPv4_address || user.ipv4_address;
                       user.sms_notify_ind = user.SMS_notify_ind || user.sms_notify_ind;
                       console.log("user:",user);
                       let result = await userService.baseCreate(user);
                       return res.json(baseResult.SUCCESS);
                   }catch(e) {
                       next(e);
                   }
               }catch (err2) {
                   next(err2);
               }

            }catch (err) {
                next(err);
            }
        })
        /**
         * return eg :
         * {
              "valid_until": "2019-08-28T06:21:39.527Z",
              "token_string": "string",
              "refresh_token": "string"
            }
         */
        router.get('/userLogin',async(req, res,next) => {
            console.log("Login param:=>",req.query);
            if (req.query) {
                console.log(req.query);
                let userLoginParam = utils.keyLowerCase(req.query);
                userLoginParam.user_name = userLoginParam.username || userLoginParam.user_name;

                try {
                    if (!userLoginParam.ipv4_address) {
                        throw  baseResult.USER_IPV4_ERROR
                    }
                    if (!userLoginParam.user_name || !userLoginParam.password) {
                        throw baseResult.USER_INVALID_NAME_PASSWD;
                    }
                    let result = await  userService.loginHandler(userLoginParam)
                    if (result) {
                        const tokenInfo = {
                            valid_until: result.valid_until,
                            token_string:result.token_string,
                            refresh_token: result.refresh_token
                        };
                        return res.json(tokenInfo);
                    }

                } catch (e) {
                    next(e);
                }
            }
        })


        router.post("/updateUser", async (req, res, next) => {
            let userId = req.user_id;
            try {
                if (userId) {
                    let userForUpdated = req.body;
                    userForUpdated.ipv4_address = userForUpdated.IPv4_address;
                    userForUpdated.sms_notify_ind = userForUpdated.SMS_notify_ind;
                    if (!userForUpdated.user_name || !userForUpdated.password) {
                        throw  baseResult.USER_INVALID_NAME_PASSWD;
                    }
                    if (!userForUpdated.first_name || !userForUpdated.last_name || !userForUpdated.email_address || !userForUpdated.contact_no) {
                        throw baseResult.USER_MANDATORY_FIELD_EXCEPTION;
                    }
                    await userService.baseUpdate(userForUpdated, {where:{user_id: userId}});

                    return res.json(baseResult.SUCCESS);

                } else {
                    throw  baseResult.USER_VERITY_INVALID
                }
            } catch (e) {
                next(e);
            }
        })
        // /user/refreshAccessToken

        router.post('/refreshAccessToken',async(req,res,next) => {
            try {
                let query = req.body;
                if (!query.refresh_token ) {
                    throw baseResult.USER_REFRESH_TOKEN_MUST_BE_SUPPLIED;
                }
                if (!query.ipv4_address) {
                    throw  baseResult.USER_IPV4_ERROR
                }
                if (!query.user_name || !query.password) {
                    throw baseResult.USER_INVALID_NAME_PASSWD;
                }
                if (!query.grant_type || query.grant_type !== 'refresh_token') {
                    throw baseResult.USER_GRANT_TYPE_MUST_BE_REFRESH_TOKEN;
                }
                let result =  await userService.refreshAccessToken(query);
                if (result) {
                    const tokenInfo = {
                        valid_until: result.valid_until,
                        token_string:result.token_string,
                        refresh_token:result.refresh_token,
                        token_type:'Bearer'
                    };
                    return res.json(tokenInfo);
                }
            }catch (e) {
                next(e);
            }
        })
        return router;
    }

}
module.exports = UserController.initRouter();