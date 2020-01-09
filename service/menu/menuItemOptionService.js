import BaseService from '../baseService.js'
import {AutoWritedMenuItemOption} from '../../common/AutoWrite.js'
import activeIndStatus from "../../model/activeIndStatus";
import menuItemService from './menuItemService'

@AutoWritedMenuItemOption
class MenuItemOptionService extends BaseService{
    constructor(){
        super(MenuItemOptionService.model)
    }

    getMenuItemOptionsByMenuItems(menuItems) {
        let promiseArr = [];
        menuItems.forEach(value => {
            // ['option_id','seq_no','opt_txt','opt_desc','unit_price','currency_code']
            let p = this.baseFindByFilter(null,{menu_item_id:value.menu_item_id,active_ind:activeIndStatus.ACTIVE}).then(options => {
                let rawValue = value.toJSON();
                rawValue.menu_item_option_list = options;
                return rawValue;
            })
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }

    copyOptionsByItemId(item_id,new_item_id,trans) {
        return this.getModel().findAll({where:{menu_item_id:item_id},transaction:trans}).then(
            optionList => {
                let promiseArr = [];
                    optionList.forEach((eachOption,index) => {
                        let copyOption = eachOption.toJSON();
                        let p = this.nextId('seq_no',{transaction:trans}).then(nextSeq => {
                            copyOption.option_id = null;
                            copyOption.menu_item_id = new_item_id;
                            copyOption.seq_no = nextSeq+index;
                            return this.baseCreate(copyOption,{transaction:trans})

                        })
                        promiseArr.push(promiseArr);
                    })
                    return Promise.all(promiseArr);
            }
        )
    }

    batchInsert(menuItem, t) {
        let optionList = menuItem.menu_item_option_list;
        let toAddList = [];
        if (optionList) {
            optionList.forEach(o => {
                    o.menu_item_id = menuItem.menu_item_id;
                    o.option_id = null; //
                toAddList.push(o);
            })
         return this.baseCreateBatch(toAddList,{transaction:t})
        }
    }
    batchUpdateStatus(menuItem, updatedStatus, t) {
        return this.getModel().findAll({where:{menu_item_id:menuItem.menu_item_id,active_ind:activeIndStatus.ACTIVE}}).then( optionList => {
            console.log("old options =>",optionList);
            let promiseArr = [];
            optionList.forEach(value => {
                promiseArr.push(this.baseUpdate({active_ind:updatedStatus},{where:{option_id:value.option_id},transaction:t}));
            })
            return Promise.all(promiseArr);
        })
    }

    updateReplaceStatus(menuItem,t) {
        return this.getModel().findAll({where:{menu_item_id:menuItem.menu_item_id,active_ind:activeIndStatus.ACTIVE}}).then( optionList => {
            let promiseArr = [];
            optionList.forEach(value => {
                promiseArr.push(this.baseUpdate({active_ind:activeIndStatus.REPLACE},{where:{menu_item_id:menuItem.menu_item_id,option_id:value.option_id,active_ind:activeIndStatus.ACTIVE},transaction:t}));
            })
            return Promise.all(promiseArr);
        })
    }
    updateStatusByMenuId(menu_id,status,t) {
        return menuItemService.getActiveMenuListByMenuId(menu_id,t).then(menuItemList => {
            let promiseArr = [];
            menuItemList.forEach(item => {
                promiseArr.push(this.updateReplaceStatus(item,t));
            })
            return Promise.all(promiseArr);
        })
    }

    batchInsertOptions(menu_item_option_list, t) {
        let promiseArr = [];
        if (menu_item_option_list && menu_item_option_list.length > 0) {
            menu_item_option_list.forEach(op => {
                  op.option_id = null;
                  promiseArr.push(this.baseCreate(op,{transaction:t}));
            })
            return Promise.all(promiseArr);
        }

    }
}
//module.exports = new MenuItemOptionService()
export default new MenuItemOptionService();