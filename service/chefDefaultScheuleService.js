import BaseService from './baseService.js'
import {AutoWritedDefaultScheule} from '../common/AutoWrite.js'
import db from '../config/db.js'
import baseResult from "../model/baseResult";
import chefService from './chefService'
@AutoWritedDefaultScheule
class ChefDefaultScheuleService extends BaseService{
    constructor(){
        super(ChefDefaultScheuleService.model)
    }
    checkDefaultScheule(data) {
        if (!data.chef_id) {
            throw baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
        }
        if (!data.mon && !data.tue && !data.wed && !data.thu
            && !data.fri && !data.sat && data.sun && !data.holiday) {
            throw baseResult.TIMESLOT_PICK_ERROR;
        }
        return db.transaction(t => {
            return this.getModel().findOne({where:{chef_id:data.chef_id},transaction:t}).then(_chef => {
                if (!_chef)
                    throw baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
                console.log("data=>",data)
                return this.getModel().update(data,{where:{chef_id:data.chef_id},transaction: t})
            }).catch(e => {
                throw  e;
            })
        })
    }



    mapToDb(data) {
        let result = {};
        result.mon = data.monday;
        result.tue = data.tuesday;
        result.wed = data.wednesday;
        result.thu = data.thursday;
        result.fri = data.friday;
        result.sat = data.saturday;
        result.sun = data.sunday;
        return result;
    }

}
module.exports = new ChefDefaultScheuleService()