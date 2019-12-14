import BaseService from './baseService.js'
import {AutoWritedChefLocation} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
import activeIndStatus from "../model/activeIndStatus";
@AutoWritedChefLocation
class ChefLocationService extends BaseService{
    constructor(){
        super(ChefLocationService.model)
    }

    getLocationsByMenuList(menuList,total_pages,t){
        if (menuList) {
            let promiseArr = [];
            menuList.forEach(value => {

                promiseArr.push(this.baseFindByFilter(['district_code'],{chef_id:value.chef_id}).then(districtList => {
                    value.chef_service_locations = districtList;
                    value.public_ind = value.public_ind.readUInt8(0)
                    value.total_pages = total_pages;
                    return value;
                }))
            })
            return Promise.all(promiseArr);
        }
    }

    countByDistrict(districtCode) {
        return this.getModel().count({where:{district_code:districtCode,active_ind:activeIndStatus.ACTIVE}})
    }
}
module.exports = new ChefLocationService()