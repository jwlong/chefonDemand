/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';

const router = express.Router()
// 请求前缀为/chef
class UserController {
    static initRouter(){
        /***************User 业务***************/
        router.post('/createUser',  (req, res) => {
            userService.checkBeforeCreate(req.body,res);
            userService.baseCreate(req.body).then(result => {
                return res.sendStatus(200);
            }).catch(error => {
                res.status(401).json({msg:'user\'s first name, last name and short description fields are mandatory.'})
            })
           // try{res.json(await chefService.baseCreate(req.body))}catch(err){next(err)}
        })
        return router;
    }

}
module.exports = UserController.initRouter();