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
                let result = await chefService.getChefDetailByChefId(chef_id);
                res.json(result);
            }catch (e) {
                next(e);
            }
        })

        //  chef/retrieveAvailTimeslots
        router.get('/retrieveAvailTimeslots',async(req,res,next) => {
            console.log("Retrieve available timeslots by chef Id,req query:",req.query)
            let query = utils.keyLowerCase(req.query);
            console.log("hello",req.query.chef_id);
            if (!query['chef_id']){
               return res.json(baseResult.CHEF_ID_NOT_EXIST);
            }
            try {
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