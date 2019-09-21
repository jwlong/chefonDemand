import BaseService from '../baseService.js'
import {AutoWritedIncludeItem} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
const Op = Sequelize.Op
@AutoWritedIncludeItem
class IncludeItemService extends BaseService{
    constructor(){
        super(IncludeItemService.model)
    }

    /**
     * {
  "include_items": [
    {
      "include_item_id": 0,
      "item_name": "string",
      "item_desc": "string"
    }
  ]
}
     */
    getMenuIncludeItems() {
        let fileds = ['include_item_id','item_name','item_desc'];
        return this.baseFindByFilter(fileds,{active_ind:activeIndStatus.ACTIVE}).then(includeItems => {
            let result = {};
            result.include_items = includeItems;
            return result;
        });
    }

    getMenuIncludeItemsByMenuId(menu_id) {
        let sql = `select item.include_item_id,item.item_name,item.item_desc from t_menu_include mi left join t_include_item item on mi.include_item_id = item.include_item_id and item.active_ind = :status
where mi.active_ind = :status and mi.menu_id =  :menuId`;
        return db.query(sql,{replacements:{status:activeIndStatus.ACTIVE,menuId:menu_id},type:db.QueryTypes.SELECT}).then(includeItems => {
            let result = {};
            result.menu_id = menu_id;
            result.include_items = includeItems;
            return  result;
        })
    }
}

module.exports = new IncludeItemService()