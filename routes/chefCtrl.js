/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import chefService from '../service/chefService';
import userService from  '../service/userService'
import cfg from '../config/index'
import baseResult from '../model/baseResult'
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
                user.update_by = req.user_id? req.user_id:cfg.robot_id; // 0 表示机器人
                user.create_by = req.user_id? req.user_id:cfg.robot_id; // 0 表示机器人
                let newChef = await chefService.processCreateChef(user);
                console.log("inserted new chef success! it's :",newChef);
                return res.json(baseResult.SUCCESS);
            }catch (e) {
                console.warn(e);
                next(e)
            }
           // try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        return router;
    }
}
module.exports = ChefController.initRouter();