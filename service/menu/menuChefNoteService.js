import BaseService from '../baseService.js'
import {AutoWritedMenuChefNote} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import chefMenuService from  '../chefMenuService';
const Op = Sequelize.Op
@AutoWritedMenuChefNote
class MenuChefNoteService extends BaseService{
    constructor(){
        super(MenuChefNoteService.model)
    }

    getMenuChefNoteByMenuId(menu_id) {
        let fileds = ['menu_chef_note_id','menu_chef_note'];
        return this.baseFindByFilter(fileds,{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}).then(notes => {
            let result = {};
            result.menu_id = menu_id;
            result.menu_chef_note_list = notes;
            return result;
        })
    }

    copyChefNote(last_menu_id, new_menu_id, t) {
        this.getModel().findAll({where:{menu_id:last_menu_id}}).then(list => {
            let copyList = [];
            list.forEach(chefNote => {
                chefNote.menu_id = new_menu_id;
                copyList.push(chefNote);
            })
            return this.baseCreateBatch(copyList,{transaction:t});
        })
    }

    updateChefNoteByDirectly(status, last_menu_id, new_menu_id, attrs, t) {
        if (last_menu_id  == new_menu_id) {
            return new Promise(resolve => {});
        }
        if (!new_menu_id) {
            new_menu_id = menu_id;
        }
       return chefMenuService.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(updatedMenu => {
            let promiseArr = [];
            let newList = [];
            let p1 = this.baseUpdate({active_ind:status},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
            promiseArr.push(p1);
            console.log("attrs ==========>",attrs)
            attrs.forEach((item,index) => {
                item.menu_id = new_menu_id;
                let p = this.nextId('menu_chef_note_id',{transaction:t}).then(nextId => {
                    item.menu_chef_note_id = nextId + index;
                    return this.baseCreate(item,{transaction:t})
                })
                promiseArr.push(p);
               // promiseArr.push(this.baseCreateBatch(newList,{transaction:t}));
            })

            return Promise.all(promiseArr);
        })
    }

}

//module.exports = new MenuChefNoteService()
export  default new MenuChefNoteService();