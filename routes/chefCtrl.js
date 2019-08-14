/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import chefService from '../service/chefService';
import userService from  '../service/userService'
import cfg from '../config/index'
const router = express.Router()
// 请求前缀为/chef
class ChefController {
    static initRouter(){
        /***************chef 业务***************/
        router.post('/createChef',  async (req, res,next) => {
            try {
                let result = await userService.checkBeforeCreate(req.body)
                if(result && result.code) {
                    return res.status(result.code).json(result);
                }
                let user = req.body;
                user.user_id = await userService.max('user_id')+1;
                user.update_by = req.user_id || cfg.robot_id; // 0 表示机器人
                user.active_ind = 0; // 初始为0，表示不激活
                user.ipv4_address = user.IPv4_address;
                user.sms_notify_ind = user.SMS_notify_ind;
                await chefService.processCreateChef(req.body);
            }catch (e) {
                next(e);
            }
            next();
           // try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        return router;
    }
}
module.exports = ChefController.initRouter();