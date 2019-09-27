import BaseService from '../baseService.js'
import {AutoWritedKitchenReq} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import chefMenuService from '../chefMenuService'
import db from '../../config/db';
import baseResult from "../../model/baseResult";
const Op = Sequelize.Op
@AutoWritedKitchenReq
class KitchenReqService extends BaseService{
    constructor(){
        super(KitchenReqService.model)
    }
    getMenuKitchenRequirementByMenuId(criteria) {
       return chefMenuService.getMenuWithoutItemsByCriteria(criteria).then(menu => {
            if (menu) {
                return this.getKitchenReqItemDetail(menu.menu_id).then(reqlist => {
                    let result = {};
                    result.menu_id = menu.menu_id
                    result.kitchen_req_items = reqlist;
                    return result
                })
            } else {
                throw baseResult.MENU_ID_NOT_EXIST;
            }
        })
    }

    getKitchenReqItemDetail(menuId) {
        let sql = `select 
         item.kitchen_req_item_id,item.item_name,item_desc,req.qty from t_menu_kitchen_req req  left join t_kitchen_req_item item on req.kitchen_req_item_id = item.kitchen_req_item_id and item.active_ind =:status where req.menu_id =:menuId and req.active_ind =:status `;
       return db.query(sql,{replacements:{menuId:menuId,status:activeIndStatus.ACTIVE},type:db.QueryTypes.SELECT});
    }

    copyKitchenReq(last_menu_id, new_menu_id, t) {
        return this.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(list => {
            let newList = [];
            list.forEach(kitchenReq => {
                kitchenReq.menu_id = new_menu_id;
                newList.push(kitchenReq);
            })
            return this.baseCreateBatch(newList,{transaction:t});
        })
    }
}

module.exports = new KitchenReqService()