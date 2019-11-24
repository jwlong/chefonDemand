import BaseService from './baseService.js'
import {AutoWritedChefLocation} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
@AutoWritedChefLocation
class ChefLocationService extends BaseService{
    constructor(){
        super(ChefLocationService.model)
    }

    getLocationsByMenuList(menuList,total_pages,t){
        if (menuList) {
            let promiseArr = [];
            promiseArr.push(this.baseFindByFilter(['district'],{chef:value.chef_id}).then(districtList => {
                value.chef_service_locations = districtList;
                value.total_pages = total_pages;
                return value;
            }))
            return Promise.all(promiseArr);
        }
    }
}
module.exports = new ChefLocationService()