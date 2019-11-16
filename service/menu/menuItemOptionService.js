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
        let promiseArr = [];
        if (optionList) {
            optionList.forEach(o => {
                let p = this.nextId('seq_no',{transaction:t}).then(nextSeq => {
                    o.menu_item_id = menuItem.menu_item_id;
                    o.seq_no = nextSeq;
                    this.baseCreate(o,{transaction:t})

                })
                promiseArr.push(p);
            })
            return Promise.all(promiseArr);
        }
    }
    batchUpdateStatus(menuItem, updatedStatus, t) {
        this.getModel().findAll({where:{menu_item_id:menuItem.menu_item_id,active_ind:activeIndStatus.ACTIVE}}).then( optionList => {
            let promiseArr = [];
            optionList.forEach(value => {
                value.active_ind = updatedStatus;
                promiseArr.push(this.baseUpdate(value,{transaction:t}));
            })
            return Promise.all(promiseArr);
        })
    }
}
module.exports = new MenuItemOptionService()