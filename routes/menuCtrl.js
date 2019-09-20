/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import baseResult from "../model/baseResult";
import chefMenuService from '../service/chefMenuService'
import chefService from "../service/chefService";
import activeIndStatus from "../model/activeIndStatus";

const router = express.Router()
// 请求前缀为/menu
class MenuController {
    static initRouter(){
        /***************menu 业务***************/
        router.post('/createMenuNameByChefId',  async(req, res,next) => {
            try {
                let chef = await chefService.getChefByUserId(req.user_id)
                console.log("chef====>",chef);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_CREATE_MENU;
                }
                let attr = req.body;
                attr.chef_id = chef.chef_id;
                await chefMenuService.createMenuNameByChefId(attr)
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        router.get('/getMenuByMenuId',async(req, res,next) => {
            try {
                let query = req.query;
                let userId = req.user_id;
                if (!query.menu_id) {
                    throw baseResult.MENU_ID_NOT_EXIST
                }
                let criteria = {menu_id:query.menu_id,act_ind:activeIndStatus.ACTIVE}
                if (!userId  || (userId && !await chefService.isChefWithUserId(userId))) {
                    criteria.public_ind = 1;
                }
                let result = await  chefMenuService.getMenuByMenuId(criteria);
                console.log("result ====>",result);
                res.json(result);
            }catch (e) {
                next(e)
            }
        })

        //(Func14a) Chef update his menu
        router.post('/updateMenuByChefId',async(req,res,next) =>{
            try {

            }catch (e) {
                next(e);
            }
        })

        //(Func16) Get active (public / non-public) menu info for listing by chef Id
        ///menu/getMenuListByChefId
        router.get('/getMenuListByChefId',async(req,res,next) =>{
            try {

            }catch (e) {
                next(e);
            }
        })
        return router;



    }

}
module.exports = MenuController.initRouter();