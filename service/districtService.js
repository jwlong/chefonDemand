import BaseService from './baseService.js'
import {AutoWritedDistrict} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
import chefLocationService from './chefLocationService';


import db from '../config/db'
import utils from "../common/utils";
@AutoWritedDistrict
class DistrictService extends BaseService{
    constructor(){
        super(DistrictService.model)
    }
    updateChefServiceLocation(attrs) {
        if (!attrs.location_list  || (attrs.location_list && attrs.location_list.length == 0) ){
            throw baseResult.CHEF_DISTRICT_LIST_EMPTY
        }
        //batch update
       return db.transaction(t=>{
           let promiseArr = [];
            attrs.location_list.forEach(districtObj => {

                let p= this.getModel().findOne({where:{district_code:districtObj.district_code},transaction:t}).then(_district =>{

                    if(!_district) throw baseResult.CHEF_DISTRICT_CODE_NOT_EXIST;
                    //insert t_chef_service_location
                    let handlerObj = {chef:attrs.chef_id,district:districtObj.district_code};

                   return chefLocationService.getModel().findOne({where:handlerObj}).then( chefLocation => {
                        if (chefLocation) {
                            return chefLocationService.getModel().update({active_ind:districtObj.active_ind},{where:{chef:attrs.chef_id,district:districtObj.district_code},transaction:t})
                        }else{
                            handlerObj.active_ind = districtObj.active_ind;
                            utils.setCustomTransfer(handlerObj,'create');
                            return chefLocationService.getModel().create(handlerObj,{transaction:t})
                        }
                    })
                })

                promiseArr.push(p);
            })
           return Promise.all(promiseArr);
        })
    }
}
module.exports = new DistrictService()