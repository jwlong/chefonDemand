import BaseService from './baseService.js'
import {AutoWritedUserMenuView} from '../common/AutoWrite.js'
import activeIndStatus from "../model/activeIndStatus";
import cfg from '../config/index'

@AutoWritedUserMenuView
class UserMenuViewService extends BaseService{

    constructor(){
        super(UserMenuViewService.model)
    }
}
module.exports = new UserMenuViewService