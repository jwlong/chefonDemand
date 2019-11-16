/**
 * Created by aa on 2019/8/11.
 */
import express from 'express'
import userService from '../service/userService';
import cfg from '../config/index'
import baseResult from "../model/baseResult";
import utils from "../common/utils";

const router = express.Router()
// 请求前缀为/menu/
class UserController {
    static initRouter(){
        router.post('')
        return router;
    }
}