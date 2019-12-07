/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import baseResult from "../model/baseResult";
import chefMenuService from '../service/chefMenuService'
import chefService from "../service/chefService";
import activeIndStatus from "../model/activeIndStatus";
import userRateService from '../service/userRateService'
import kitchenReqItemService from '../service/menu/kitchenReqItemService'
import kitchenReqService from '../service/menu/kitchenReqService'
import menuChefNoteService from '../service/menu/menuChefNoteService'
import includeItemService from  '../service/menu/includeItemService'
import userPrefService from '../service/userPrefService'
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
                let criteria = {menu_id:query.menu_id,active_ind:activeIndStatus.ACTIVE}
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


        /*
        /menu/getMenuServingDetailByMenuId
        */
        router.get('/getMenuServingDetailByMenuId',async(req,res,next) => {
            try {
                let menu_id = req.query.menu_id;
                if (!menu_id) {
                    throw baseResult.MENU_ID_FILED_MANDATORY;
                }
                let criteria = {menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}
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


        // func_14a

        router.post('/updateMenuByChefId',async(req,res,next) => {
            try {
                let menu_id = req.body.menu_id;
                if (!menu_id) {
                    throw baseResult.MENU_ID_FILED_MANDATORY;
                }
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                await chefMenuService.updateMenuByChefId(chef.chef_id,menu_id,req.body)
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        //(Func16) Get active (public / non-public) menu info for listing by chef Id
        ///menu/getMenuListByChefId
        router.get('/getMenuListByChefId',async(req,res,next) =>{
            try {
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.CHEF_ID_NOT_EXIST;
                }
                res.json(await  chefMenuService.getMenuListByChefId(chef.chef_id));
            }catch (e) {
                next(e);
            }
        })
        // func 20 /menu/findMenuByFilters

        router.get('/findMenuByFilters',async(req,res,next) =>{
            try {
                let query = req.body;
                chefService.checkFilters(query);
                query.pageSize = await userPrefService.getPageSize(req.user_id)
                chefService.covertQueryParam(query);
                await chefService.checkParam(query);
                console.log("query => ",query);
                res.json(await  chefMenuService.findMenuByFilters(query))
            }catch (e) {
                next(e);
            }
        })



        // func22: /menu/updateMenuServingDetailByMenuId
        router.post('/updateMenuServingDetailByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                let chef = await chefService.getChefByUserId(req.user_id);
                console.log("chef =====>",chef.chef_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                attrs.chef_id = chef.chef_id;
                await  chefMenuService.updateMenuServingDetailByMenuId(attrs.chef_id,attrs.menu_id,attrs);
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        // func#25: /menu/updateMenuKitchenRequirementByMenuId
        router.post('/updateMenuKitchenRequirementByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }

                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                await  chefMenuService.updateMenuKitchenRequirementByMenuId(chef.chef_id,attrs.menu_id,attrs);
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        //func 27 /menu/updateMenuChefNoteByMenuId
        router.post('/updateMenuChefNoteByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }

                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                await  chefMenuService.updateMenuChefNoteByMenuId(chef.chef_id,attrs.menu_id,attrs);
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        // func#30: /menu/updateMenuIncludeItemsByMenuId
        router.post('/updateMenuIncludeItemsByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }

                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                await  chefMenuService.updateMenuIncludeItemsByMenuId(chef.chef_id,attrs.menu_id,attrs);
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        //func#32: /menu/updateMenuAboutByMenuId
        router.post('/updateMenuAboutByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }

                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_UPDATE;
                }
                attrs.chef_id = chef.chef_id;
                await  chefMenuService.updateMenuAboutByMenuId(chef.chef_id,attrs.menu_id,attrs);
                res.json(baseResult.SUCCESS)
            }catch (e) {
                next(e);
            }
        })

        // func#33: /menu/getMenuRatingByMenuId
        router.get('/getMenuRatingByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                let criteria = await chefMenuService.checkUserIdAndMenuId(req.user_id,attrs.menu_id);
                console.log("func 33 criteria========> ",criteria);
                res.json(await  chefMenuService.getMenuRatingByMenuId(criteria));
            }catch (e) {
                next(e);
            }
        })
        // func34# /menu/getMenuReviewsByMenuId
        router.get('/getMenuReviewsByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                if (!attrs || !attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                await chefMenuService.checkUserIdAndMenuId(req.user_id,attrs.menu_id);
                res.json(await  chefMenuService.getMenuReviewsByMenuId(attrs.menu_id));
            }catch (e) {
                next(e);
            }
        })

       // func#35: /menu/addMenuReviewsByMenuId
        router.post('/addMenuReviewsByMenuId',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs.menu_id) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                let chef = await chefService.getChefByUserId(req.user_id);
                if (chef) {
                    // if user is chef throw error
                    throw baseResult.MENU_ONLY_REGULAR_USER_CAN_DO
                }
                attrs.user_id = req.user_id;
                await  userRateService.addMenuReviewsByMenuId(attrs);
                res.json(baseResult.SUCCESS);
            }catch (e) {
                next(e);
            }
        })
        // func#41: /menu/updateMenuVisibility
        router.post('/updateMenuVisibility',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                console.log("headers param:",attrs);
                if (!attrs.menu_id || !attrs.public_ind) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                let chef = chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_MODIFY
                }
                attrs.chef_id = chef.chef_id;
                await  chefMenuService.updateMenuVisibility(attrs);
                res.json(baseResult.SUCCESS)

            }catch (e){
                next(e);
            }
        })

        //func#43: /menu/updateMenuCancelPolicy
        router.post('/updateMenuCancelPolicy',async(req,res,next) =>{
            try {
                let attrs = req.body;
                if (!attrs.menu_id || !attrs.cancel_policy) {
                    throw baseResult.MENU_QUERY_PARAM_MANDATORY;
                }
                let chef = await  chefService.getChefByUserId(req.user_id);
                if (!chef) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_MODIFY
                }
                attrs.chef_id = chef.chef_id;
                console.log("updateMenuCancelPolicy attrs===>",attrs);
                await  chefMenuService.updateMenuCancelPolicy(attrs);
                res.json(baseResult.SUCCESS)

            }catch (e){
                next(e);
            }
        })
        // func#52: /menu/getMenuListByChefsChoice
        router.get('/getMenuListByChefsChoice',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                if (!attrs.page_no) {
                    throw 'page_no is required!'
                }
                let publicStatusArr = await chefMenuService.getPublicIndStatusArr(req.user_id);
                attrs.pageSize = await userPrefService.getPageSize(req.user_id)
                if (attrs.page_no <= 0) {
                    attrs.page_no = 1;
                }
                attrs.startIdx = (attrs.page_no -1)*attrs.pageSize;
                attrs.publicIndArr = publicStatusArr;
                attrs.byRecommend = true;
                console.log("func 52 attrs: =========>",attrs)
                res.json(await chefMenuService.getMenuListByChefsChoice(attrs));
            }catch (e){
                next(e);
            }
        })
        // func#53: /menu/getMenuListByRating
        router.get('/getMenuListByRating',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                if (!attrs.page_no) {
                    throw 'page_no is required!'
                }
                let publicStatusArr = await chefMenuService.getPublicIndStatusArr(req.user_id);
                attrs.pageSize = await userPrefService.getPageSize(req.user_id)
                attrs.startIdx = (attrs.page_no -1)*attrs.pageSize;
                attrs.publicIndArr = publicStatusArr;
                attrs.byRating = true;
                res.json(await chefMenuService.getMenuListByRating(attrs));
            }catch (e){
                next(e);
            }
        })
        // func#54: /menu/getMenuListByPopular
        router.get('/getMenuListByPopular',async(req,res,next) =>{
            try {
                let attrs = req.headers;
                if (!attrs.page_no) {
                    throw 'page_no is required!'
                }
                let publicStatusArr = await chefMenuService.getPublicIndStatusArr(req.user_id);
                attrs.pageSize = await userPrefService.getPageSize(req.user_id)
                attrs.startIdx = (attrs.page_no -1)*attrs.pageSize;
                attrs.publicIndArr = publicStatusArr;
                attrs.byPopular = true;
                res.json(await chefMenuService.getMenuListBy(attrs));
            }catch (e){
                next(e);
            }
        })
        //func#60: /menu/getArchiveDetailByChefId
        router.get('/getArchiveDetailByChefId',async(req,res,next) =>{
            try {
                let chef = await chefService.getChefByUserId(req.user_id);
                if (!chef){
                    throw baseResult.MENU_ONLY_CHEF_CAN_DO_THIS;
                }
                res.json(await chefMenuService.getArchiveDetailByChefId(chef.chef_id));
            }catch (e){
                next(e);
            }
        })




        return router;

    }

}
module.exports = MenuController.initRouter();