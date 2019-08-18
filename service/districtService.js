import BaseService from './baseService.js'
import {AutoWritedDistrict} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
import db from '../config/db'
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
       db.transaction(t=>{
            attrs.location_list.forEach(districtObj => {
                return this.getModel().findOne(districtObj.district_code,{transaction:t}).then(_district =>{

                    if(!_district) throw baseResult.CHEF_DISTRICT_CODE_NOT_EXIST;

                    return this.getModel().update({active_ind:_district.active_ind},
                        {where: {district_code:_district.district_code},transaction:t});
                })
            })
        })
    }
}
module.exports = new DistrictService()