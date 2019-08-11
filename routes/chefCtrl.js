/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import chefService from '../service/chefService';

const router = express.Router()
// 请求前缀为/chef
class ChefController {
    static initRouter(){
        /***************chef 业务***************/
        router.post('/createChef',  (req, res) => {
            chefService.checkBeforeCreate(req.body,res);
            chefService.createChef(req.body).then(result => {
                return res.sendStatus(200);
            }).catch(error => {
                res.status(401).json({msg:'Chef\'s first name, last name and short description fields are mandatory.'})
            })
           // try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        return router;
    }

}
module.exports = ChefController.initRouter();