/**
 * Created by aa on 2019/9/22.
 */
import BaseService from '../baseService.js'
import {AutoWritedMenuSection} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import baseResult from '../../model/baseResult'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
import chefService from '../chefService'
const Op = Sequelize.Op
@AutoWritedMenuSection
class MenuSectionService extends BaseService{
    constructor(){
        super(MenuSectionService.model)
    }

    sectionCrudCheck(user_id, chef_id) {
        chefService.getChefByUserId(user_id).then(chefUser => {
                if (!chefUser) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_DO_THIS;
                }
                return chefService.getChefByChefId(chef_id).then( chef => {
                    if (!chef) {
                        throw baseResult.MENU_CHEF_MUST_BE_ACTIVE;
                    }
                })
            }
        );

    }

    getChefMenuSectionsByChefId(chef_id) {
        let fields = ['menu_section_id','menu_section_name','menu_section_desc'];
        return this.baseFindByFilter(fields,{chef_id:chef_id,act_ind:activeIndStatus.ACTIVE}).then(sectionList =>{
            let result = {};
            result.chef_id = chef_id;
            result.section_list = sectionList;
            return result;
        })
    }

    /**
     *     attr{
          "chef_id": 0,
          "menu_section_name": "string",
          "menu_section_desc": "string"
        }
     * @param attr
     */
    addChefMenuSection(attr) {
      return  db.transaction(t=> {
        return  chefService.getChefIngoreStatusByChefId(attr.chef_id,t).then(chef => {
                if (!chef) {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }else {
                    if (chef.active_ind !== activeIndStatus.ACTIVE){
                        throw baseResult.MENU_CHEF_MUST_BE_ACTIVE;
                    }
                }
              return this.getModel().count({where:{menu_section_name:attr.menu_section_name,act_ind:activeIndStatus.ACTIVE},transaction:t}).then(cnt => {
                   if (cnt > 0) {
                       throw  baseResult.MENU_SECTION_NAME_EXISTS;
                   }
                   attr.act_ind = activeIndStatus.ACTIVE;
                   return this.baseCreate(attr,{transaction:t});
               })
          })
        })
    }
    /**
     *
     * @param attr {
          "chef_id": 0,
          "menu_section_id": 0,
          "menu_section_name": "string",
          "menu_section_desc": "string"
        }
     */
    editChefMenuSection(attr) {
        return db.transaction(t => {
            return chefService.getChefByChefId(attr.chef_id,t).then(chef => {
                if (!chef) {
                    throw baseResult.MENU_CHEF_MUST_BE_ACTIVE;
                }
                return this.getModel().count({where:{menu_section_name:attr.menu_section_name,act_ind:activeIndStatus.ACTIVE},transaction:t}).then(cnt => {
                    if (cnt > 0) {
                        throw  baseResult.MENU_SECTION_NAME_EXISTS;
                    }
                    return this.getModel().count({where:{menu_section_id:attr.menu_section_id,chef_id:attr.chef_id},transaction:t}).then( sectionCnt => {
                        if (sectionCnt >0) {
                            attr.act_ind = activeIndStatus.ACTIVE;
                            return this.baseUpdate(attr,{where:{chef_id:attr.chef_id,menu_section_id:attr.menu_section_id},transaction:t});
                        }else {
                            throw baseResult.MENU_SECTION_ID_NOT_BELONG_CHEF;
                        }
                    })
                })
            })
        })

    }

    /**
     *attr.chef_id 当前用户的chef表的chef_id
     * @param attr    {
      "menu_section_id": 0
    }
     */
    removeChefMenuSection(attr) {
        return db.transaction(t => {
          return  chefService.getChefByChefId(attr.chef_id,t).then(chef => {
                if (!chef) {
                    throw baseResult.MENU_CHEF_MUST_BE_ACTIVE;
                }
                return this.getModel().count({where:{menu_section_id:attr.menu_section_id,act_ind:activeIndStatus.ACTIVE},transaction:t}).then(cnt => {
                    if (!cnt ||  cnt === 0) {
                        throw  baseResult.MENU_SECTION_ID_NOT_EXISTS;
                    }
                    return this.getModel().count({where:{menu_section_id:attr.menu_section_id,chef_id:attr.chef_id,act_ind:activeIndStatus.ACTIVE},transaction:t}).then( sectionCnt => {
                        if (sectionCnt >0) {
                            attr.act_ind = activeIndStatus.INACTIVE;
                            return this.baseUpdate(attr,{where:{menu_section_id:attr.menu_section_id},transaction:t});
                        }else {
                            throw baseResult.MENU_SECTION_ID_NOT_BELONG_CHEF;
                        }
                    })
                })
            })
        })


    }
}
module.exports = new MenuSectionService()