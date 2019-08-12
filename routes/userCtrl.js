/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';
import accessTokenService from '../service/accessTokenService';
import jwt from "jwt-simple"
import cfg from '../config/index'

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
                       try {
                           user.update_by = 100001;
                           user.active_ind = 1;
                           user.ipv4_address = user.IPv4_address;
                           user.sms_notify_ind = user.SMS_notify_ind;
                           console.log("user:",user);
                           let result = await userService.baseCreate(user);
                           res.sendStatus(200);
                       }catch (e) {
                           res.sendStatus(500);
                          next(e);
                       }

                   }catch (err2) {
                       next(err2);
                   }
                }
            }catch (err) {
                next(err);
            }

           /* await userService.baseCreate(req.body).then(result => {
                return res.sendStatus(200);
            }).catch(error => {
                res.status(401);
            })*/

        })

        router.get('/userLogin',async(req, res,next) => {
            console.log("Login param:=>",req.query);
            if (req.query) {
                console.log(req.query.IPv4_address);
                if (!req.query.IPv4_address) {
                    res.status(401).json({msg: 'IPv4_address must be supplied'});
                }else {
                    try {
                        const  rows = await userService.login(req.query,res)
                        if (rows.length>0 && rows[0].user_id) {
                            console.log("userId:",rows[0].user_id);
                            const payload = {id: rows[0].user_id};
                            const tokenInfo = {
                                access_status:'ok',
                                access_token: jwt.encode(payload, cfg.jwtSecret),
                            };
                            res.json(tokenInfo);
                            let tokenData = {};
                            tokenData.user_id = rows[0].user_id;
                            tokenData.token_string = tokenInfo.access_token;
                            tokenData.ipv4_address = req.query.IPv4_address;
                            tokenData.create_by = rows[0].user_id;
                            await accessTokenService.baseCreate(tokenData);
                        } else {
                            res.status(400).json({msg: 'Invalid username/password supplied'})
                        }
                    }catch (e) {
                         next(e);
                    }
                }
            }
        })


        return router;
    }

}
module.exports = UserController.initRouter();