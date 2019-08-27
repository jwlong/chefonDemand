import BaseService from './baseService.js'
import {AutoWritedDistrict} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
import chefLocationService from './chefLocationService';
import db from '../config/db'
import utils from "../common/utils";
import activeIndStatus from "../model/activeIndStatus";
import Sequelize from 'sequelize'
const Op = Sequelize.Op
@AutoWritedDistrict
class DistrictService extends BaseService{
    constructor(){
        super(DistrictService.model)
    }

    /**
     * 更新chef_service_location
     * 如果chef_id下已经存在了传过来的district_code则更新，没有的话就插入
     * @param attrs
     * @returns Promise
     */
    updateChefServiceLocation(attrs) {
        if (!attrs.location_list  || (attrs.location_list && attrs.location_list.length == 0) ){
            throw baseResult.CHEF_DISTRICT_LIST_EMPTY
        }
        //batch update
       return db.transaction(t=>{
           let promiseArr = [];
           let district_codes = [];
           attrs.location_list.forEach(districtObj => {
                district_codes.push(districtObj.district_code);
                let p= this.getModel().findOne({where:{district_code:districtObj.district_code},transaction:t}).then(_district =>{

                    if(!_district) throw baseResult.CHEF_DISTRICT_CODE_NOT_EXIST;
                    //insert t_chef_service_location
                    let handlerObj = {chef:attrs.chef_id,district:districtObj.district_code};

                   return chefLocationService.getModel().findOne({where:handlerObj}).then( chefLocation => {
                        if (chefLocation) {
                            return chefLocationService.baseUpdate({active_ind:districtObj.active_ind},{where:{chef:attrs.chef_id,district:districtObj.district_code},transaction:t})
                        }else{
                            handlerObj.active_ind = districtObj.active_ind;
                            return chefLocationService.baseCreate(handlerObj,{transaction:t})
                        }
                    })
                })
                promiseArr.push(p);
            })
           // inactive  the record of  not in update list
           if (district_codes.length > 0) {
               let inactivePromise = chefLocationService.baseUpdate({active_ind:activeIndStatus.INACTIVE},{where:{chef:attrs.chef_id,district:{[Op.notIn]:district_codes}},transaction:t})
               promiseArr.push(inactivePromise);
           }
           return Promise.all(promiseArr);
        })
    }
}
module.exports = new DistrictService()