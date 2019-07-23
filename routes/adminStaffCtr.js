import express from 'express'
import chefService from '../service/chefService';//引入了就会创建表 ,当model.sync()存在
import chefLanguageService from '../service/chefLanguageService'
import cuisineTypeService from '../service/cuisineTypeService'
const router = express.Router()
//访问前缀 /staff

class AdminStaffController {
    static initRouter(){
        /***************staff 业务***************/
        router.get('/all', async (req, res, next) => {
            //try{res.json(await chefService.baseFindAll())}catch(err){next(err)}
            try{res.json(await chefService.getChefList(req.query))}catch(err){next(err)}
        })
        router.get('/find',async (req,res,next) =>{
            try{res.json(await chefService.baseFindByFilter(null,req.query))}catch(err){next(err)}
        })
        router.put('/update', async (req, res, next) => {
            // 拼update sql
            if (!req.body['where']){
                req.body['where'] = {city_code:req.body.city_code} // 查询条件
            }
            console.log(req.body['where'])
            try{res.json(await chefService.baseUpdate(req.body, req.body['where']))}catch(err){next(err)}
        })

        router.delete('/delete', async (req, res, next) => {
            try{res.json(await chefService.baseDelete(req.body))}catch(err){next(err)}
        })
        router.post('/create', async (req, res, next) => {
            try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        router.post('/createBatch', async (req, res, next) => {
            try{res.json(await chefService.baseCreateBatch(req.body['entitys']))}catch(err){next(err)}
        })
        // 2. findChefByPopularity  Finds top 6 chefs by highest rating
        router.get('/findChefByPopularity', async (req, res, next) => {
            try{res.json(await chefService.baseCreateBatch(req.body['entitys']))}catch(err){next(err)}
        })

        router.get('/getChefLangByChefId', async (req, res, next) => {
            try{res.json(await chefLanguageService.getChefLangByChefId(req.query))}catch(err){next(err)}
        })


        // getCuisineTypes
        router.get('/getCuisineTypes', async (req, res, next) => {
            try{res.json(await cuisineTypeService.baseFindAll())}catch(err){next(err)}
        })

        // findMenuByChefId
        router.get('/findMenuByChefId', async (req, res, next) => {
            try{res.json(await chefService.getMenuByChefId(req.body))}catch(err){next(err)}
        })

        //getChefDetailByChefId
        router.get('/getChefDetailByChefId', async (req, res, next) => {
            try{res.json(await chefService.getChefDetailByChefId(req.body))}catch(err){next(err)}
        })
        return router;
    }

}
module.exports = AdminStaffController.initRouter();
