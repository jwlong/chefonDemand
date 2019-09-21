import BaseService from '../baseService.js'
import {AutoWritedIncludeItem} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
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
}

module.exports = new IncludeItemService()