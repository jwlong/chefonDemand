/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import baseResult from "../model/baseResult";
import chefMenuService from '../service/chefMenuService'

const router = express.Router()
// 请求前缀为/user
class MenuController {
    static initRouter(){
        /***************menu 业务***************/
        router.post('/createMenuNameByChefId',  async(req, res,next) => {})

        router.get('/getMenuByMenuId',async(req, res,next) => {
            try {
                let query = req.query;
                if (!query.menu_id) {
                    throw baseResult.MENU_ID_NOT_EXIST
                }
                let result = await  chefMenuService.getMenuByMenuId(req.user_id,query.menu_id);
                console.log("result ====>",result);
                res.json(result);
            }catch (e) {
                next(e)
            }
        })
        return router;
    }

}
module.exports = MenuController.initRouter();