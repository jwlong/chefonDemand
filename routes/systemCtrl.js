import express from 'express'
//import cityService from '../service/cityService.js'
import systemService from '../service/systemService'

const router = express.Router()

class SystemController {
    static initRouter(){
        /***************system 业务***************/
        router.get('/obtainAccessToken', async (req, res, next) => {
            try{res.json(await systemService.obtainAccessToken(req.query))}catch(err){next(err)}
        })
/*
        router.get('/all', async (req, res, next) => {
            try{res.json(await cityService.baseFindAll())}catch(err){next(err)}
        })

        router.get('/find',async (req,res,next) =>{

        })
        router.put('/update', async (req, res, next) => {
            // 拼update sql
            if (!req.body['where']){
                req.body['where'] = {city_code:req.body.city_code} // 查询条件
            }
            console.log(req.body['where'])
            try{res.json(await cityService.baseUpdate(req.body, req.body['where']))}catch(err){next(err)}
        })
        router.delete('/delete', async (req, res, next) => {
            try{res.json(await cityService.baseDelete(req.body))}catch(err){next(err)}
        })
        router.post('/create', async (req, res, next) => {
            try{res.json(await cityService.baseCreate(req.body))}catch(err){next(err)}
        })
        router.post('/createBatch', async (req, res, next) => {
            try{res.json(await cityService.baseCreateBatch(req.body['entitys']))}catch(err){next(err)}
        })*/
        return router;
    }

}
module.exports = SystemController.initRouter();
