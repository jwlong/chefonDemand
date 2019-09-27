import BaseService from './baseService.js'
import {AutoWritedChefMenu} from '../common/AutoWrite.js'
import db from "../config/db";
import chefService from './chefService'
import activeIndStatus from "../model/activeIndStatus";
import menuItemService from './menu/menuItemService'
import menuItemOptionService from './menu/menuItemOptionService'
import menuCuisineService from './menu/menuCuisineService'
import kitchenReqService from './menu/kitchenReqService'
import menuIncludeService from './menu/menuIncludeService'
import menuChefNoteService from './menu/menuChefNoteService'
//t_menu_booking_rule
import menuBookingRuleService from './menu/menuBookingRuleService'
import menuBookingRequirementService from './menu/menuBookingRequirementService'
import menuExtraChargeService from './menu/menuExtraChargeService'
import menuPhotoService from './menu/menuPhotoService'
import moment from 'moment'
import baseResult from "../model/baseResult";

@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }

    preparedChefMenu(attr) {
        //default value
        attr.public_ind = 0;
        attr.applied_meal = 3;
        attr.unit_price = 0.0000;
        attr.instant_ind = 1;
        attr.min_pers = 1;
        attr.event_duration_hr = 2.00;
        attr.chef_arrive_prior_hr = 1;
        attr.act_ind = activeIndStatus.ACTIVE;
        attr.menu_code =  attr.chef_id+moment().format('YYYYMMDDHHmmSSSS')
    }
    createMenuNameByChefId(attr) {
        this.preparedChefMenu(attr);
        return db.transaction(t=> {
           return this.nextId('menu_id',{transaction:t}).then(nextId => {
                attr.menu_id = nextId;
               return this.nextId('seq_no',{transaction:t}).then(nextSeqNo => {
                    attr.seq_no = nextSeqNo;
                    return this.baseCreate(attr,{transaction:t})
                })
            })
        })
    }

    /**
     * criteria 默认包含menu_id属性
     * @param criteria
     * @returns {*}
     */
    getMenuWithoutItemsByCriteria(criteria) {
        return this.getOne({where:criteria});
    }
    getMenuByMenuId(criteria) {
        //no user id only can get public menu
        return this.getModel().findOne({attributes:['chef_id','menu_id','menu_name',
                'menu_code','menu_desc','public_ind'],where:criteria}).then(resp => {
                    let result  = resp.toJSON();
            return menuItemService.baseFindByFilter(['menu_item_id','seq_no','item_type_id','max_choice','note','optional'],{menu_id:criteria.menu_id,act_ind:activeIndStatus.ACTIVE}).then(menuItems => {

                return menuItemOptionService.getMenuItemOptionsByMenuItems(menuItems).then(menuItemResult => {
                    result.menu_item_list = menuItemResult;
                    return result;
                })

            })
        });
    }

    /**
     * "chef_id": 0,
     "menu_id": 0,
     "menu_name": "string",
     "menu_code": "string",
     "menu_desc": "string",
     "public_ind": true,
     "seq_no": 0,
     "menu_rating": 0,
     "num_of_review": 0,
     "min_pers": 0,
     "max_pers": 0,
     "menu_logo_url": "string",
     "unit_price": 0,
     * @param chef_id
     */
    getMenuListByChefId(chef_id) {
        return this.baseFindByFilter(['chef_id', 'menu_id', 'menu_name', 'menu_code', 'public_ind', 'seq_no', 'menu_rating', 'num_of_review', 'min_pers', 'max_pers', 'menu_logo_url', 'unit_price'], {
            chef_id: chef_id,
            act_ind: activeIndStatus.ACTIVE
        });
    }
    /**
     * {
  "menu_id": 0,
  "applied_meal": 1,
  "min_pers": 0,
  "max_pers": 0,
  "event_duration_hr": 0,
  "chef_arrive_prior_hr": 0,
  "child_menu_note": "string"
}
     * @param criteria
     */
    getMenuServingDetailByMenuId(criteria) {
        let fileds = ['menu_id','applied_meal','min_pers','max_pers','event_duration_hr','chef_arrive_prior_hr','child_menu_note'];
        return this.getOne({attributes:fileds,where:criteria});
    }

    /**
     * check user_id ,menu_id是否合法，合法返回menu_id下的 查询条件数据
     * @param user_id
     * @param menu_id
     * @returns {PromiseLike<T> | Promise<T>}
     */
    checkUserIdAndMenuId(user_id, menu_id) {
        if (!menu_id) {
            throw baseResult.MENU_ID_FILED_MANDATORY;
        }
       return chefService.preparedMenuQueryCriteria(user_id,menu_id).then( criteria => {
                return this.getMenuWithoutItemsByCriteria(criteria).then(menu => {
                    if (!menu) throw baseResult.MENU_ID_NOT_EXIST;
                    else
                        return criteria;
                });
            }
        );
    }

    /**
     *
     * @param criteria 默认包含menu_id
     * @returns {*}
     */
    getMenuAboutByMenuId(criteria) {
        let fields = ['menu_id','about'];
        return this.getOne({attributes:fields,where:criteria});
    }

    cloneMenuCheck(user_id, menu_id) {
        return chefService.getChefByUserId(user_id).then(chef => {
            if (chef){
               return this.getMenuWithoutItemsByCriteria({chef_id:chef.chef_id,menu_id:menu_id,act_ind:activeIndStatus.ACTIVE}).then(menu => {
                   if (!menu) throw baseResult.MENU_MENUID_NOT_BELONG_TO_CHEF;
                   this.cloneProcess(menu);
               })
            } else {
                throw baseResult.MENU_ONLY_CHEF_CAN_CREATE_MENU;
            }
        })
    }

    getMenuCancelPolicy(criteria) {
        let fields = ['menu_id','cancel_policy'];
        return this.getOne({attributes:fields,where:criteria});
    }

    cloneProcess(menu) {
        // first query
        db.transaction(t => {
            // create new menu
            let last_menu_id = menu.menu_id;
            menu.menu_id = null;
            return this.baseCreate(menu,{transaction:t}).then(newMenu => {
                let new_menu_id = newMenu.menu_id;
                 // copy t_menu_item
                 let copyMenuItem = menuItemService.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(items => {
                     let promiseArr = [];
                     items.forEach(item => {
                         item.menu_id = new_menu_id;
                         promiseArr.push(menuItemService.baseCreate(item,{transaction:t}));
                         promiseArr.push(this.copy(menuItemOptionService,item.menu_item_id,t));
                     })
                     //t_menu_cuisine
                     promiseArr.push(this.copy(menuCuisineService,last_menu_id,new_menu_id,t));
                     // copy t_menu_kitchen_req
                     promiseArr.push(this.copy(kitchenReqService,last_menu_id,new_menu_id,t));
                     // copy t_menu_include
                     promiseArr.push(this.copy(menuIncludeService,last_menu_id,new_menu_id,t));
                     // copy t_menu_chef_note
                     promiseArr.push(this.copy(menuChefNoteService,last_menu_id,new_menu_id,t));
                     //copy t_menu_booking_rule
                     promiseArr.push(this.copy(menuBookingRuleService,last_menu_id,new_menu_id,t));
                     //copy t_menu_booking_requirement
                     promiseArr.push(this.copy(menuBookingRequirementService,last_menu_id,new_menu_id,t));
                     // copy t_menu_extra_charge
                     promiseArr.push(this.copy(menuExtraChargeService,last_menu_id,new_menu_id,t));
                     // copy  t_menu_photo
                     promiseArr.push(this.copy(menuPhotoService,last_menu_id,new_menu_id,t));
                     return Promise.all(promiseArr);
                 });
            })
        })
        this.baseCreate(menu,)
    }
    copy(service, last_menu_id,new_menu_id,t) {
        service.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(list => {
            let copyList = [];
            list.forEach(single => {
                single.menu_id = new_menu_id;
                copyList.push(single);
            })
            service.baseCreateBatch(copyList,{transaction:t});
        })
    }
}
module.exports = new ChefMenuService()