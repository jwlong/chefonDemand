import BaseService from './baseService.js'
import {AutoWritedChefAVLTimeSlot} from '../common/AutoWrite.js'
import baseResult from "../model/baseResult";

@AutoWritedChefAVLTimeSlot
class ChefAvailableTimeSlotService extends BaseService{
    constructor(){
        super(ChefAvailableTimeSlotService.model)
    }
    retrieveAvailTimeslots(chefId) {
       return this.baseFindByFilter(['start_date','end_date','instant_ind','available_meal'],{chef_id:chefId})
    }
}
module.exports = new ChefAvailableTimeSlotService()