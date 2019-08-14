/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';
import accessTokenService from '../service/accessTokenService';
import jwt from "jsonwebtoken"
import cfg from '../config/index'
import uuid from 'uuid';

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

                       let max = await  userService.max('user_id');
                       if (!user.user_id) {
                           user.user_id = max +1;
                       }
                       user.update_by = req.user_id;
                       user.active_ind = 'A';
                       user.ipv4_address = user.IPv4_address;
                       user.sms_notify_ind = user.SMS_notify_ind;
                       console.log("user:",user);
                       try {
                           let result = await userService.baseCreate(user);
                           return res.sendStatus(200);
                       }catch(e) {
                           console.log(e);
                             res.status(401).json({msg:'user first name, last name, email address and contact no. fields are mandatory.'})
                           next(e);
                       }

                   }catch (err2) {
                       next(err2);
                   }
                }else {
                    res.status(hasError.code).json(hasError);
                }
            }catch (err) {
                next(err);
            }
        })

        router.get('/userLogin',async(req, res,next) => {
            console.log("Login param:=>",req.query);
            if (req.query) {
                console.log(req.query);
                if (!req.query.IPv4_address) {
                   return  res.status(401).json({msg: 'IPv4_address must be supplied'});
                }else {
                    try {
                        const  rows = await userService.login(req.query,res)
                        if (rows.length>0 && rows[0].user_id) {
                            console.log("userId:",rows[0].user_id);
                            let uniqueString = uuid.v1();
                            let tokenData = {};
                            let maxTokenId = (await accessTokenService.max('token_id'));
                            tokenData.token_id = maxTokenId?(maxTokenId +1):1;
                            tokenData.user_id = rows[0].user_id;
                            tokenData.token_string = uniqueString;
                            tokenData.ipv4_address = req.query.IPv4_address;
                            tokenData.create_by = rows[0].user_id;
                            try{
                                var result = await accessTokenService.baseCreate(tokenData)
                                if (result) {
                                    const tokenInfo = {
                                        access_status:'ok',
                                        access_token: jwt.sign({id:result.user_id}, cfg.jwtSecret,{expiresIn:'24h'}),
                                    };
                                    res.json(tokenInfo);
                                }
                            }catch (e) {
                                res.status(401).json(e.errors)
                                next(e);
                            }
                        } else {
                            res.status(400).json({msg: 'Invalid username/password supplied'})
                        }
                    }catch (e) {
                         next(e);
                    }
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
                    await userService.baseUpdate(userForUpdated,{user_id:decoded.id});
                }catch (e) {
                    console.error(e);
                    return res.status(401).json({msg:'user first name, last name, email address and contact no. fields are mandatory.'})
                }
                return res.status(200).json({msg:'successful operation'});
            }else {
                return res.status(421).json({msg:'Verification Code is invalid.'});
            }
            next();
        })
        return router;
    }

}
module.exports = UserController.initRouter();