/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import chefService from '../service/chefService';
import userService from  '../service/userService'
import cfg from '../config/index'
import baseResult from '../model/baseResult'
import chefLanguageService from   '../service/chefLanguageService'
import chefAvailableTimeSlotService from '../service/chefAvailableTimeSlotService'
import districtService from '../service/districtService'
import moment from 'moment'
import utils from "../common/utils";
const router = express.Router()
var userContext = require('../common/userContext')
// 请求前缀为/chef
class ChefController {
    static initRouter(){
        /***************chef 业务***************/

        // create chef
        router.post('/createChef',  async (req, res,next) => {
            console.log("come in createChef...");
            try {
                // 此时不验证是否为robot
                let result = await userService.checkBeforeCreate(req.body,false)
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
        router.post('/updateChef',  async (req, res,next) => {
            console.log("updateChef...req body=>",req.body);
            try {
                let attr = utils.keyLowerCase(req.body);
                if (Array.isArray(attr.experience_list)) {
                    attr.experience_list.forEach(value => {
                        if (!value.exp_desc) {
                            value.exp_desc = value.experience_description
                        }
                        if (!value.exp_desc || !value.start_date) {
                            throw baseResult.CHEF_EXP_LIST_FILED_INVALID;
                        }
                        if (value.start_date && value.end_date){
                            if (moment(value.end_date).isBefore(moment(value.start_date))) {
                                throw 'experience_list end_date is before start_date';
                            }
                        }
                    });
                }
                if (!attr.password) {
                    throw baseResult.PASSWD_NOT_BE_EMPTY;
                }

                let chef = await chefService.updateChef(attr)
                console.log("chef: ", chef);
                return res.json(baseResult.SUCCESS);
            }catch (e) {
                console.warn(e);
                next(e)
            }
        })

        //  /chef/updateChefQualification (func5b)
        router.post('/updateChefQualification',async (req,res,next) => {
            let attrs = utils.keyLowerCase(req.body);
            console.log("Update chef user qualification information,param=> ",attrs);
            try {
                await chefService.checkChefIsExist(attrs.chef_id)
                let result = await chefService.updateChefQualification(attrs);
                console.log("result=>",result)
                res.json(baseResult.SUCCESS);
            }catch (e) {
                console.warn(e);
                next(e);
            }
        })

        /*{
            "chef_Id": 0,
            "location_list": [
            {
                "district_code": "string",
                "active_ind": true
            }
        ]
        }*/
        router.post('/setupChefLanguage',async (req,res,next) => {
            console.log("update chef user account's service locations by chef,request body =>",req.body);
            let attrs = utils.keyLowerCase(req.body);
            try {
                await chefService.checkChefIsExist(attrs.chef_id)
                let result = await chefLanguageService.setupChefLanguage(attrs);
                console.log("result=>",result)
                res.json(baseResult.SUCCESS);
            }catch (e) {
                next(e);
            }

        })
        router.post('/updateChefServiceLocation',async(req,res,next) => {
            console.log("update chef user account's service locations by chef,request body =>",req.body);
            let attrs = utils.keyLowerCase(req.body);
            try {
                await  chefService.checkChefIsExist(attrs.chef_id)
                let result = await districtService.updateChefServiceLocation(attrs);
                res.json(baseResult.SUCCESS);
            }catch (e) {
                next(e);
            }

        })
        // chef_Id  header
        router.get('/getChefDetailByChefId',async(req,res,next) => {
            let chef_id = req.headers.chef_Id || req.headers.chef_id;
            if (!chef_id) res.json(baseResult.CHEF_ID_NOT_EXIST);
            try {
               let result =  await chefService.getChefDetailByChefId(chef_id);
            /*   let tmp = JSON.parse(JSON.stringify(result));
               let result1= tmp.chef;
               result1.language_code_list = tmp.language_code_list;
               result1.cuisine_type = tmp.cuisine_type;
               result1.experience_list = tmp.experience_list;*/
        res.json(result);
            }catch (e) {
                next(e);
            }
        })

        //  chef/retrieveAvailTimeslots
        router.get('/retrieveAvailTimeslots',async(req,res,next) => {
            console.log("Retrieve available timeslots by chef Id,req query:",req.query)
            let query = utils.keyLowerCase(req.query);
            if (!query['chef_id']){
               return res.json(baseResult.CHEF_ID_NOT_EXIST);
            }
            try {
                let chef = await chefService.getChefByChefId(query['chef_id']);
                if (!chef) {
                    throw baseResult.CHEF_ID_NOT_EXIST;
                }
                let result = await chefAvailableTimeSlotService.retrieveAvailTimeslots(query)
               // result.chef_Id = query.chef_id;
                return res.json(result);
            }catch (e){
                next(e);
            }
        })
        return router;


    }


}
module.exports = ChefController.initRouter();