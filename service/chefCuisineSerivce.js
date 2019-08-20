import BaseService from './baseService.js'
import {AutoWritedChefCuisine} from '../common/AutoWrite.js'
import utils from "../common/utils";
import cuisineTypeService from "./cuisineTypeService";

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
                        type = utils.setCustomTransfer(type,'create');
                        return this.getModel().create(type,{transaction:t})
                    }else if (cnt === 1) {
                        return this.getModel().update(type,{where:{chef_id:chefId,cuisine_type_id:type.cuisine_type_id},transaction:t})
                    }

                });
            } else {
                throw 'cuisine_type not exist! cuisine_type_id: '+type.cuisine_type_id;
            }
        })
    }
}
module.exports = new ChefCuisineService()