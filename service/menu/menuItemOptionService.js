import BaseService from '../baseService.js'
import {AutoWritedMenuItemOption} from '../../common/AutoWrite.js'
import activeIndStatus from "../../model/activeIndStatus";

@AutoWritedMenuItemOption
class MenuItemOptionService extends BaseService{
    constructor(){
        super(MenuItemOptionService.model)
    }

    getMenuItemOptionsByMenuItems(menuItems) {
        let promiseArr = [];
        menuItems.forEach(value => {
            let p = this.baseFindByFilter(['option_id','seq_no','opt_txt','opt_desc','unit_price','currency_code'],{menu_item_id:value.menu_item_id,active_ind:activeIndStatus.ACTIVE}).then(options => {
                let rawValue = value.toJSON();
                rawValue.menu_item_option_list = options;
                return rawValue;
            })
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }
}
module.exports = new MenuItemOptionService()