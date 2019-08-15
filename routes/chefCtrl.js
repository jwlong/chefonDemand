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
            console.log("come in createChef...");
            try {
                // 此时不验证是否为robot
                let result = await userService.checkBeforeCreate(req.body,false)
                console.log("new result ",result);

                if(result && result.code) {
                    return res.json(result);
                }

                let user = req.body;
                user.user_id = await userService.getNextId('user_id');
                console.log("in request user_id : ",req.user_id);
                user.update_by = req.user_id? req.user_id:cfg.robot_id; // 0 表示机器人
                user.create_by = req.user_id? req.user_id:cfg.robot_id; // 0 表示机器人
                user.active_ind = 'A'; // 初始为0，表示不激活
                user.ipv4_address = user.IPv4_address;
                user.sms_notify_ind = user.SMS_notify_ind;

                let createdUser = await userService.baseCreate(user);
                let newChef = await chefService.processCreateChef(createdUser);
                console.log("new Chef",newChef);
                if (newChef) {
                    res.sendStatus(200);
                }
            }catch (e) {
                console.warn(e);
                res.sendStatus(401).json({msg:'Chef\'s first name, last name and short description fields are mandatory.'})
                next(e)
            }
            //next();
           // try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        return router;
    }
}
module.exports = ChefController.initRouter();