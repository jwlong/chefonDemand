import express from 'express'
import chefMenuService from "../service/chefMenuService";
import chefService from "../service/chefService";
import menuSectionSevice from "../service/menu/menuSectionSevice";

import baseResult from "../model/baseResult";

const router = express.Router();

class MenuFoodSelectionCtroller {
    static initRouter() {
        router.post('/cloneMenuByMenuId', async (req, res, next) => {
            let param = req.headers;
            if (param.menu_id || param.access_token || param.content_type) {
                throw baseResult.MENU_MENUID_TOKEN_CONTENT_TYPE_MANDATORY;
            }
            await chefMenuService.cloneMenuCheck(req.user_id, req.headers.menu_id);
            //clone next...

        });
        // /menu/getChefMenuSections:
        router.get('/getChefMenuSections',async(req,res,next) => {
            try {
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef){
                    throw baseResult.MENU_ONLY_CHEF_CAN_DO_THIS;
                }
                /*let chef_id = chef.chef_id;
                let menuList = await chefMenuService.getMenuListByChefId(chef_id)
                if (!menuList || menuList.length == 0) {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }*/
                res.json(await menuSectionSevice.getChefMenuSectionsByChefId(chef.chef_id));
            }catch (e) {
                next(e);
            }
        })
        ///menu/addChefMenuSection
        router.post('/addChefMenuSection',async(req,res,next) => {
            try {
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef){
                    throw baseResult.MENU_ONLY_CHEF_CAN_ADD_SECTION;
                }
                let attr = req.body;
                if (!attr.chef_id) {
                   throw baseResult.MENU_CHEF_ID_NOT_EXISTS;
                }
                await menuSectionSevice.addChefMenuSection(attr);
                res.json(baseResult.SUCCESS);
            }catch (e) {
                next(e);
            }
        })
        // /menu/editChefMenuSection
        router.post('/editChefMenuSection',async(req,res,next) =>{
           try {
               let chef = await chefService.getChefByUserId(req.user_id);
               if (!chef){
                   throw baseResult.MENU_ONLY_CHEF_CAN_ADD_SECTION;
               }
               await menuSectionSevice.editChefMenuSection(req.body);
               res.json(baseResult.SUCCESS);
           }catch (e) {
               next(e);
           }
        })
        // /menu/removeChefMenuSection
        router.post('/removeChefMenuSection',async(req,res,next) =>{
            try {
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef){
                    throw baseResult.MENU_ONLY_CHEF_CAN_ADD_SECTION;
                }
                let attr = req.body;
                if (!attr.menu_section_id) {
                    throw  baseResult.MENU_SECTION_ID_NOT_EXISTS;
                }
                attr.chef_id = chef.chef_id;
                await menuSectionSevice.removeChefMenuSection(attr);
                res.json(baseResult.SUCCESS);
            }catch (e) {
                next(e);
            }
        })

        return router;
    }

}

module.exports = MenuFoodSelectionCtroller.initRouter();