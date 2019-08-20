import BaseService from './baseService.js'
import {AutoWritedChefExp} from '../common/AutoWrite.js'
import utils from "../common/utils";

@AutoWritedChefExp
class ChefExperienceService extends BaseService{
    constructor(){
        super(ChefExperienceService.model)
    }

    updateChefReferToExperience(singleChef,exp,t) {
       return this.getModel().findAll({where:{chef_id:singleChef.chef_id},transaction:t}).then(expList => {
            if (Array.isArray(expList) && expList.length > 0) {
               // utils.setCustomTransfer(exp,'update');
                return this.getModel().update(exp,{where:{chef_id:singleChef.chef_id},transaction:t})
            }else {
                return this.getModel().max('exp_id',{transaction:t}).then(maxId => {
                    exp.exp_id = maxId?maxId+1:1;
                    exp.chef_id = singleChef.chef_id;
                    utils.setCustomTransfer(exp,'create');
                    return this.getModel().create(exp, { transaction: t });
                })

            }
        })
    }
}
module.exports = new ChefExperienceService()