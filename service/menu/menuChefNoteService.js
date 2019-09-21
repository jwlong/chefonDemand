import BaseService from '../baseService.js'
import {AutoWritedMenuChefNote} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
const Op = Sequelize.Op
@AutoWritedMenuChefNote
class MenuChefNoteService extends BaseService{
    constructor(){
        super(MenuChefNoteService.model)
    }

    getMenuChefNoteByMenuId(menu_id) {
        let fileds = ['menu_chef_note_id','menu_chef_note'];
        this.baseFindByFilter(fileds,{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}.then(notes => {
            let result = {};
            result.menu_id = menu_id;
            result.menu_chef_note_list = notes;
            return result;
        }))
    }
}

module.exports = new MenuChefNoteService()