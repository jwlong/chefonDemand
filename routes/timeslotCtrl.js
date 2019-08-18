import express from 'express'
import chefService from '../service/chefService';//引入了就会创建表 ,当model.sync()存在
import chefLanguageService from '../service/chefLanguageService'
import cuisineTypeService from '../service/cuisineTypeService'
const router = express.Router()
//访问前缀 /staff

class TimeSlotController {
    static initRouter(){
        /***************TimeSlot 业务***************/
        router.post('/updateChefAvailableTimeSlot', async (req, res, next) => {
            //try{res.json(await chefService.baseFindAll())}catch(err){next(err)}
            try{res.json(await chefService.getChefList(req.query))}catch(err){next(err)}
        })

        router.post('/updateChefUnAvailableTimeSlot', async (req, res, next) => {
            //try{res.json(await chefService.baseFindAll())}catch(err){next(err)}
            try{res.json(await chefService.getChefList(req.query))}catch(err){next(err)}
        })


        router.post('/updateChefDefaultTimeSlot', async (req, res, next) => {
            //try{res.json(await chefService.baseFindAll())}catch(err){next(err)}
            try{res.json(await chefService.getChefList(req.query))}catch(err){next(err)}
        })
        return router;
    }

}
module.exports = TimeSlotController.initRouter();
