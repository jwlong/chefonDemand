import BaseService from './baseService.js'
import {AutoWritedChefLocation} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
import activeIndStatus from "../model/activeIndStatus";
import db from "../config/db";

@AutoWritedChefLocation
class ChefLocationService extends BaseService{
    constructor(){
        super(ChefLocationService.model)
    }

    getLocationsByMenuList(menuList,t){
        if (menuList) {
            let promiseArr = [];
            menuList.forEach(value => {
                promiseArr.push(this.getChefLocationDetail(value.chef_id).then(districtList => {
                    value.chef_service_locations = districtList;
                    value.public_ind = value.public_ind.readUInt8(0)
                    if (value.orderPlacedNum)  {
                        delete value.orderPlacedNum;
                    }
                    return value;
                }))
            })
            return Promise.all(promiseArr);
        }
    }
    getChefLocationDetail(chef_id,trans) {
        let sql = `select  location.district_code, t.district_name
                    from t_chef_service_location location
                    left join t_district t on location.district_code = t.district_code and t.active_ind = 'A'
                    where chef_id = :chef_id and location.active_ind = 'A' `;
        return db.query(sql,{replacements:{chef_id:chef_id},type:db.QueryTypes.SELECT,transaction:trans});
    }
    countByDistrict(districtCode) {
        return this.getModel().count({where:{district_code:districtCode,active_ind:activeIndStatus.ACTIVE}})
    }
}
module.exports = new ChefLocationService()