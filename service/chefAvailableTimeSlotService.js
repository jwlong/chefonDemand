import BaseService from './baseService.js'
import {AutoWritedChefAVLTimeSlot} from '../common/AutoWrite.js'
import baseResult from "../model/baseResult";
import chefService from './chefService'
import db from '../config/db'
import utils from "../common/utils";

@AutoWritedChefAVLTimeSlot
class ChefAvailableTimeSlotService extends BaseService {
    constructor() {
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
        if (!data.available_timeslot_list || (Array.isArray(data.available_timeslot_list) && data.available_timeslot_list.length === 0) || !Array.isArray(data.available_timeslot_list)) {
            throw  baseResult.TIMESLOT_LIST_EMPTY;
        }

        data.available_timeslot_list.forEach(timeslot => {
            timeslot.start_date = new Date(timeslot.start_date);
            timeslot.end_date = new Date(timeslot.end_date);
            if (timeslot.start_date.getTime() > timeslot.end_date.getTime()) {
                throw baseResult.TIMESLOT_INVALID_DATETIME;
            }
        })
        return chefService.getChefByChefId(data.chef_id).then(_chef => {
            if (!_chef) {
                throw  baseResult.TIMESLOT_CHEF_ID_NOT_FOUND;
            }
        })

    }

    retrieveAvailTimeslots(query) {
        return this.baseFindByFilter(['start_date', 'end_date', 'instant_ind', 'available_meal'], query).then(avail_timeslot_list =>{
            let queryResult =  {};
            queryResult.chef_id = query.chef_id;
            queryResult.avail_timeslot_list = avail_timeslot_list;
            return queryResult;
        })
    }

    updateChefAvailableTimeSlot(attr) {
        let promiseArr = [];
        return db.transaction(t => {
            let updatedPromise = this.getModel().update({active_ind:'D'},{where:{chef_id:attr.chef_id,active_ind:'A'},transaction:t});
            promiseArr.push(updatedPromise);
            attr.available_timeslot_list.forEach(timeslot => {
                timeslot.chef_id = attr.chef_id;
                let p = this.getModel().max('timeslot_id', {transaction: t}).then(maxId => {
                    timeslot.timeslot_id = maxId ? maxId + 1 : 1;
                    utils.setCustomTransfer(timeslot,'create');
                    return this.getModel().create(timeslot, {transaction: t});
                })
                promiseArr.push(p);
            })
            return Promise.all(promiseArr);
        })
    }
}

module.exports = new ChefAvailableTimeSlotService()