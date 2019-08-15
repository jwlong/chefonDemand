/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';
import accessTokenService from '../service/accessTokenService';
import jwt from "jsonwebtoken"
import cfg from '../config/index'
import uuid from 'uuid';
import baseResult from "../model/baseResult";

const router = express.Router()
// 请求前缀为/user
class UserController {
    static initRouter(){
        /***************User 业务***************/
        router.post('/createUser',  async(req, res,next) => {
            var data  = req.body;
            try {
                var hasError = await userService.checkBeforeCreate(req.body,res);
                if (!hasError) {
                   try {
                       let user = req.body;

                       user.user_id = await  userService.getNextId('user_id');

                       user.update_by = req.user_id || cfg.robot_id;
                       user.active_ind = 'A';
                       user.ipv4_address = user.IPv4_address;
                       user.sms_notify_ind = user.SMS_notify_ind;
                       console.log("user:",user);
                       try {
                           let result = await userService.baseCreate(user);
                           return res.json(baseResult.SUCCESS);
                       }catch(e) {
                           next(e);
                       }
                   }catch (err2) {
                       next(err2);
                   }
                }else {
                    res.json(hasError);
                }
            }catch (err) {
                next(err);
            }
        })

        router.get('/userLogin',async(req, res,next) => {
            console.log("Login param:=>",req.query);
            if (req.query) {
                console.log(req.query);
                let userLoginParam = req.query;
                if (!userLoginParam.IPv4_address) {
                    return res.json(baseResult.USER_IPV4_ERROR);
                }
                if (!userLoginParam.username || !userLoginParam.password) {
                    return res.json(baseResult.USER_INVALID_NAME_PASSWD)
                }
                try {
                    const rows = await userService.login(userLoginParam, res)
                    if (rows.length > 0 && rows[0].user_id) {
                        console.log("userId:", rows[0].user_id);
                        if (!userService.validPassword(rows[0].password,userLoginParam.password)) {
                            return res.json(baseResult.USER_INVALID_NAME_PASSWD);
                        }
                        let uniqueString = uuid.v1();
                        let tokenData = {};
                        tokenData.token_id = await accessTokenService.getNextId('token_id');
                        tokenData.user_id = rows[0].user_id;
                        tokenData.token_string = uniqueString;
                        tokenData.ipv4_address = userLoginParam.IPv4_address;
                        tokenData.create_by = rows[0].user_id;
                        try {
                            console.log("will insert into access_token_record:",tokenData);
                            var result = await accessTokenService.baseCreate(tokenData)
                            if (result) {
                                const tokenInfo = {
                                    access_status: '0',
                                    access_token: jwt.sign({id: result.user_id}, cfg.jwtSecret, {expiresIn: cfg.expiresIn}),
                                };
                                return res.json(tokenInfo);
                            }
                        } catch (e) {
                            next(e);
                        }
                    } else {
                        return res.json(baseResult.USER_INVALID_NAME_PASSWD);
                    }
                } catch (e) {
                    next(e);
                }
            }
        })


        router.post("/updateUser",async(req, res,next) => {
            let decoded = jwt.decode(req.headers.access_token);
            if (decoded && decoded.id) {
                let userForUpdated = req.body;
                userForUpdated.ipv4_address = userForUpdated.IPv4_address;
                userForUpdated.sms_notify_ind = userForUpdated.SMS_notify_ind;

                try {
                    let validResult = await userService.checkBeforeCreate(userForUpdated,true);
                    if (validResult) {
                        return res.json(validResult);
                    }
                    await userService.baseUpdate(userForUpdated,{user_id:decoded.id});

                    return res.json(baseResult.SUCCESS);
                }catch (e) {
                    next(e);
                }

            }else {
                return res.json(baseResult.USER_VERITY_INVALID)
            }
        })
        return router;
    }

}
module.exports = UserController.initRouter();