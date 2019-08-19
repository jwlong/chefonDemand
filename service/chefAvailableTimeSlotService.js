import BaseService from './baseService.js'
import {AutoWritedChefAVLTimeSlot} from '../common/AutoWrite.js'
import baseResult from "../model/baseResult";
import chefService from  './chefService'
import db from '../config/db'

@AutoWritedChefAVLTimeSlot
class ChefAvailableTimeSlotService extends BaseService{
    constructor(){
        super(ChefAvailableTimeSlotService.model)
    }

    /**
     *
     * @param data {
          "chef_Id": 0,
          "available_timeslot_list": [
            {
              "start_date": "2019-08-19T01:11:53.863Z",
              "end_date": "2019-08-19T01:11:53.863Z",
              "instant_ind": true,
              "available_meal": "3-both Lunch & Dinner"
            }
          ]
        }
     */
    checkIsLegal(data) {
        if (!data.chef_id) {
            throw baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
        }
        chefService.getChefByChefId(data.chef_id).then(_chef => {
            if (!_chef) {
                throw  baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
            }
        })
        if (!data.available_timeslot_list || (isArray(data.available_timeslot_list) && data.available_timeslot_list.length === 0) || !isArray(data.available_timeslot_list)) {
            throw  baseResult.TIMESLOT_LIST_EMPTY;
        }

        data.available_timeslot_list.forEach(timeslot => {
            if (timeslot.start_date.getTime() > timeslot.end_date.getTime()) {
                throw baseResult.TIMESLOT_INVALID_DATETIME;
            }
        })
    }
    retrieveAvailTimeslots(query) {
       return this.baseFindByFilter(['start_date','end_date','instant_ind','available_meal'],query)
    }

    createChefAvailableTimeSlots(attr) {
        this.checkIsLegal(attr);

        let timeslots = [];
        attr.available_timeslot_list.forEach(timeslot => {
            timeslot.chef_id = attr.chef_id;
            timeslots.push(timeslot);
        })
        return this.baseCreateBatch(timeslots)
    }
}
module.exports = new ChefAvailableTimeSlotService()