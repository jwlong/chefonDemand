import BaseService from './baseService.js'
import {AutoWritedChefExp} from '../common/AutoWrite.js'
import utils from "../common/utils";

@AutoWritedChefExp
class ChefExperienceService extends BaseService{
    constructor(){
        super(ChefExperienceService.model)
    }

    updateChefReferToExperience(singleChef,exp,t,index) {
        exp.chef_id = singleChef.chef_id;
       return this.getModel().count({where:{chef_id:singleChef.chef_id},transaction:t}).then(expCnt => {
            if (expCnt > 0) {
                //mark ref chef_id exp as 'R' and insert new record to exp_list_table
                 return this.baseUpdate({active_ind:'R'},{where:{chef_id:singleChef.chef_id},transaction:t}).then(updatedCnt => {
                    return this.insertChefExpList(exp,t,index);
                 })
            }else {
                return this.insertChefExpList(exp,t,index);
            }
        })
    }

    insertChefExpList(exp,trans,index) {
        return this.nextId('exp_id',{transaction:trans}).then(nextId => {
            exp.exp_id = nextId+index;
            return this.baseCreate(exp,{transaction:trans});
        })
    }
}
module.exports = new ChefExperienceService()