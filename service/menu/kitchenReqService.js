import BaseService from '../baseService.js'
import {AutoWritedKitchenReq} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from '../../config/db';
import chefMenu from '../../model/chefMenu'
import baseResult from "../../model/baseResult";
const Op = Sequelize.Op
@AutoWritedKitchenReq
class KitchenReqService extends BaseService{
    constructor(){
        super(KitchenReqService.model)
    }
    getMenuKitchenRequirementByMenuId(criteria) {
       return chefMenu.getModel().findOne({where:criteria}).then(menu => {
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
    getKitchenReq(menuId,kitchenReqId,t) {
        return this.getOne({where:{menu_id:menuId,kitchen_req_item_id:kitchenReqId},transaction:t})

    }
    updateDirectly(status,last_menu_id, new_menu_id,attrs, t) {
        console.log("updateMenuIncludeItemsDirectly...")
        let promiseArr = [];
        // check include_item is exits or not
        attrs.forEach(kitchenReq => {
            kitchenReq.active_ind = activeIndStatus.ACTIVE;
            let p = this.getKitchenReq(last_menu_id,kitchenReq.kitchen_req_item_id,t).then(reqItem => {
                if (reqItem) {
                    return this.baseUpdate(kitchenReq,{where:{menu_id:last_menu_id,kitchen_req_item_id:kitchenReq.kitchen_req_item_id},transaction:t})
                } else {
                    kitchenReq.menu_id = last_menu_id;
                    return this.baseCreate(kitchenReq,{transaction:t});
                }
            })
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);





  /*      let promiseArr = [];
        let newList = [];
        let p1 = this.baseUpdate({active_ind:status},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(resp=>{
            attrs.forEach(kitchenReq => {
                kitchenReq.menu_id = last_menu_id;
                newList.push(kitchenReq);
            })
            return this.baseCreateBatch(newList,{transaction:t});
        });
        promiseArr.push(p1);
        return Promise.all(promiseArr);*/
    }

}

module.exports = new KitchenReqService()