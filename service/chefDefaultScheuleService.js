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

        /*{
            "chef_Id": 0,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true,
            "Friday": true,
            "Saturday": true,
            "Sunday": true,
            "holiday": true,
            "instant_ind": true,
            "meal_type": "3-both Lunch & Dinner"
        }*/

        if (!data.monday && !data.tuesday && !data.wednesday && !data.thursday
            && !data.friday && !data.saturday && data.sunday && !data.holiday) {
            throw baseResult.TIMESLOT_PICK_ERROR;
        }
        let mapToDbAttr = this.mapToDb(data);
        return db.transaction(t => {
            return this.getModel().findOne({where:{chef_id:data.chef_id},transaction:t}).then(_chef => {
                if (!_chef)
                    throw baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
                let attrs = this.mapToDb(data);

                console.log("data=>",data)
                return this.getModel().update(attrs,{where:{chef_id:data.chef_id},transaction: t})
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