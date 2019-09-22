/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import baseResult from "../model/baseResult";
import chefMenuService from '../service/chefMenuService'
import chefService from "../service/chefService";
import activeIndStatus from "../model/activeIndStatus";
import kitchenReqItemService from '../service/menu/kitchenReqItemService'
import kitchenReqService from '../service/menu/kitchenReqService'
import menuChefNoteService from '../service/menu/menuChefNoteService'
import includeItemService from  '../service/menu/includeItemService'
import menuPhotoService from  '../service/menu/menuPhotoService'
import menuBookingRequirementService from  '../service/menu/menuBookingRequirementService'
import menuCuisineService from  '../service/menu/menuCuisineService'
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
                if (await chefService.isOnlyCanAccessPublic(userId)) {
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
                let chef_id = req.body.chef_id;
                if (!chef_id || (chef_id && !await chefService.getChefByChefId(chef_id))) {
                    throw baseResult.MENU_CHEF_ID_NOT_EXISTS;
                }
               await chefMenuService.getMenuListByChefId(chef_id);

            }catch (e) {
                next(e);
            }
        })

        /*
        /menu/getMenuServingDetailByMenuId
        */
        router.get('/getMenuServingDetailByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                if (!menu_id) {
                    throw baseResult.MENU_ID_FILED_MANDATORY;
                }
                let criteria = {menu_id:menu_id,act_ind:activeIndStatus.ACTIVE}
                if (await chefService.isOnlyCanAccessPublic(req.user_id)) {
                    criteria.public_ind = 1;
                }
              let result = await chefMenuService.getMenuServingDetailByMenuId(criteria)
                res.json(result);
            }catch (e) {
                next(e);
            }
        })

        // /menu/getMenuKitchenRequirementItems,,Get Menu Kitchen Requirement Items
        router.get('/getMenuKitchenRequirementItems',async(req,res,next) => {
            try {
                res.json(await kitchenReqItemService.getMenuKitchenRequirementItems());
            }catch (e) {
                next(e);
            }
        })

        //  /menu/getMenuKitchenRequirementByMenuId  (Func24) Get menu's Kitchen Requirement detail
        router.get('/getMenuKitchenRequirementByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                if (!menu_id) {
                    throw baseResult.MENU_ID_FILED_MANDATORY;
                }
                let criteria = await chefService.preparedMenuQueryCriteria(req.user_id,menu_id);
                res.json(await kitchenReqService.getMenuKitchenRequirementByMenuId(criteria));
            }catch (e) {
                next(e);
            }
        })
        // /menu/getMenuChefNoteByMenuId
        router.get('/getMenuChefNoteByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await menuChefNoteService.getMenuChefNoteByMenuId(menu_id));
            }catch (e) {
                next(e);
            }
        })


        ///menu/getMenuIncludeItems
        router.get('/getMenuIncludeItems',async(req,res,next) => {
            try {
                res.json(await includeItemService.getMenuIncludeItems());
            }catch (e) {
                next(e);
            }
        })

        router.get('/getMenuIncludeItemsByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await includeItemService.getMenuIncludeItemsByMenuId(menu_id));
            }catch (e) {
                next(e);
            }
        })


        /**
         * /menu/getMenuAboutByMenuId
         */
        router.get('/getMenuAboutByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                let criteria =  await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await chefMenuService.getMenuAboutByMenuId(criteria));
            }catch (e) {
                next(e);
            }
        })

        /**
         * /menu/getMenuPhotosByMenuId  Get menu's Photo URLs
         */
        router.get('/getMenuPhotosByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                let criteria =  await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await menuPhotoService.getMenuPhotosByMenuId(menu_id));
            }catch (e) {
                next(e);
            }
        })


        /**
         ​/menu​/getMenuBookingRequirement (Func38) Get Menu Chef's booking requirements for instant booking
         */
        router.get('/getMenuBookingRequirement',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                let criteria =  await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await menuBookingRequirementService.getMenuBookingRequirement(menu_id));
            }catch (e) {
                next(e);
            }
        })

        /**
         * /menu/getAvailableCuisineTypes
         */
        router.get('/getAvailableCuisineTypes',async(req,res,next) => {
            try {
                res.json(await menuCuisineService.getAvailableCuisineTypes());
            }catch (e) {
                next(e);
            }
        })

        /**
         * /menu/getMenuCancelPolicy
         */
        router.get('/getMenuCancelPolicy',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                let criteria = await chefMenuService.checkUserIdAndMenuId(req.user_id,menu_id);
                res.json(await chefMenuService.getMenuCancelPolicy(criteria));
            }catch (e) {
                next(e);
            }
        })

        return router;




    }

}
module.exports = MenuController.initRouter();