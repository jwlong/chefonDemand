import BaseService from './baseService.js'
import {AutoWritedUserPref} from '../common/AutoWrite.js'
import activeIndStatus from "../model/activeIndStatus";
import cfg from '../config/index'

@AutoWritedUserPref
class UserPrefService extends BaseService{

    constructor(){
        super(UserPrefService.model)
    }

    getPageSize(user_id) {
        if (!user_id) {
            user_id = cfg.sys_user_id;
        }
        return this.getOne({where:{user_id:user_id,active_ind:activeIndStatus.ACTIVE}}).then(userPref => {
            return userPref.num_of_item_per_page;
        })
    }
}
module.exports = new UserPrefService()