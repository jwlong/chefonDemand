import BaseService from './baseService.js'
import {AutoWritedChefCuisine} from '../common/AutoWrite.js'
import utils from "../common/utils";
import cuisineTypeService from "./cuisineTypeService";
import activeIndStatus from "../model/activeIndStatus";

@AutoWritedChefCuisine
class ChefCuisineService extends BaseService{
    constructor(){
        super(ChefCuisineService.model)
    }

    updateChefReferToCuisine(chefId,type,t) {
       return cuisineTypeService.getModel().findOne({where:{cuisine_type_id:type.cuisine_type_id},transaction:t}).then(typeDetail => {
            if (typeDetail) {
                return this.getModel().count({where:{chef_id:chefId,cuisine_type_id:type.cuisine_type_id},transaction:t}).then(cnt => {
                    type.chef_id = chefId;
                    if (!cnt || cnt === 0 ) {
                        return this.baseCreate(type,{transaction:t})
                    }else if (cnt === 1) {
                        return this.baseUpdate(type,{where:{chef_id:chefId,cuisine_type_id:type.cuisine_type_id},transaction:t})
                    }
                });
            } else {
                throw 'cuisine_type not exist! cuisine_type_id: '+type.cuisine_type_id;
            }
        })
    }

    countByTypeId(typeId,t) {
        return this.getModel().count({where:{cuisine_type_id:typeId,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }
}
module.exports = new ChefCuisineService()