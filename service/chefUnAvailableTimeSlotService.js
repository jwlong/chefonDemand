import BaseService from './baseService.js'
import {AutoWritedChefUnAVLTimeSlot} from '../common/AutoWrite.js'
import chefAvailableTimeSlotService from './chefAvailableTimeSlotService'
@AutoWritedChefUnAVLTimeSlot
class ChefUnAvailableTimeSlotService extends BaseService{
    constructor(){
        super(ChefUnAvailableTimeSlotService.model)
    }

    retrieveAvailTimeslots(chefId) {
       return this.baseFindByFilter(['start_date','end_date','instant_ind','available_meal'],{chef_id:chefId})
    }

    createChefUnAvailableTimeSlot(attr) {
        chefAvailableTimeSlotService.checkIsLegal(attr);

        let timeslots = [];
        attr.available_timeslot_list.forEach(timeslot => {
            timeslot.chef_id = attr.chef_id;
            timeslots.push(timeslot);
        })
        return this.baseCreateBatch(timeslots)
    }
}
module.exports = new ChefUnAvailableTimeSlotService()