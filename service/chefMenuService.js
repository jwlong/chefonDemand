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
import orderService from './orderService'
import messageService from './messageService'
import moment from 'moment'
import baseResult from "../model/baseResult";
import msgCfg from '../common/messgeConf'
import userService from './userService'
import stringFormat from 'string-format'
import locationService from './chefLocationService'

const Op = Sequelize.Op
@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }
    //
    updateMenuByChefIdDirectly(chef_id,menu_id,attrs) {
        let promiseArr = [];
        // 删除之前已经存在的记录
        let chefMenu = {};
        let part1 =  this.baseUpdate({active_ind:activeIndStatus.DELETE},{where:{menu_id:menu_id,chef_id:chef_id}}).then(resp => {
            chefMenu = resp.toJSON();
            return menuItemService.batchUpdateStatus(menu_id,activeIndStatus.DELETE,t).then( updatdItemList => {
                let deletePromise = [];
                if (updatdItemList) {
                    updatdItemList.forEach(item => {
                        deletePromise.push(menuItemOptionService.batchUpdateStatus(item,activeIndStatus.DELETE,t));
                    })
                }
                return Promise.all(deletePromise);
                }
            )
        })
        promiseArr.push(part1);
        // insert new record with request body and menu_code use same menu_code
        attrs.menu_code = chefMenu.menu_code;
        attrs.chef_id = chefMenu.chef_id;
        promiseArr.push(this.baseCreate(attrs,{transaction:t}));

        attrs.menu_item_list.forEach(value => {
            let  pm = menuItemService.baseCreate(value,{transaction:t}).then(item => {
                return this.baseCreate(item.menu_item_option_list,{transaction:t})
            })
           promiseArr.push(pm);
        })

        return Promise.all(promiseArr);
    }



    updateMenuByChefId(chef_id,menu_id,attrs) {
        return db.transaction(t => {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    if (chefMenu.public_ind === 1) {
                        // If any existing outstanding orders (orders not yet performed) referencing this public menu_id
                        return orderService.getModel().findAll({where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE,event_date:{[Op.gt]:moment()}},transaction:t}).then(orderList => {
                            if (orderList) {
                                // clone menu
                               return this.baseCreate(attrs,{transaction:t}).then(resp => {
                                    // copy menu_item
                                    let promiseArr = [];

                                    promiseArr.push(attrs.menu_item_list.forEach(value => {
                                      return  menuItemService.baseCreate(value,{transaction:t}).then(item => {
                                            return menuItemOptionService.batchInsert(menuItem,t);
                                        })
                                    }))
                                   promiseArr.push(this.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:menu_id,chef_id:chef_id},transaction:t}));
                                    orderList.forEach( order => {
                                        let user = userService.getById(order.user_id);
                                        let notity_username = user.first_name+" "+user.last_name;
                                        let msgBody = msgCfg.update_menu_notify.format(notity_username);
                                        promiseArr.push(messageService.insertMessage(order.user_id,msgBody,{transaction:t}));
                                    })
                                    return Promise.all(promiseArr);
                                })
                            }else {
                                return updateMenuByChefIdDirectly(chefMenu.chef_id,chefMenu.menu_id,t);
                            }
                        })
                    } else if (chefMenu.public_ind === 0) {
                        //
                        return updateMenuByChefIdDirectly(chefMenu.chef_id,chefMenu.menu_id,t);
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })


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
        if (!attr.menu_name || !attr.menu_desc) {
            throw baseResult.MENU_NAME_FIELD_MANDATORY;
        }
    }

    createMenuNameByChefId(attr) {
        this.preparedChefMenu(attr);
        return db.transaction(t => {
            return this.getModel().count({
                where: {chef_id: attr.chef_id, menu_name: attr.menu_name},
                transaction: t
            }).then(cnt => {
                if (cnt > 0) {
                    throw baseResult.MENU_NAME_EXISTS;
                }
                return this.nextId('seq_no', {transaction: t}).then(nextSeqNo => {
                    attr.seq_no = nextSeqNo;
                    return this.baseCreate(attr, {transaction: t})
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
       /* return this.baseFindByFilter(['chef_id', 'menu_id', 'menu_name', 'menu_code', 'public_ind', 'seq_no', 'min_pers', 'max_pers', 'menu_logo_url', 'unit_price'], {
            chef_id: chef_id,
            act_ind: activeIndStatus.ACTIVE
        });
*/
       let sql = `select m.chef_id, m.menu_id, m.menu_name, m.menu_code, m.public_ind, m.seq_no, m.min_pers, m.max_pers, m.menu_logo_url, m.unit_price,avg(rating.overall_rating) menu_rating ,count(rating.rating_id) num_of_review,min(m.unit_price) min_unit_price from chefondemand.t_chef_menu m left join chefondemand.t_order o on o.menu_id = m.menu_id and o.active_ind = 'A'
left join chefondemand.t_user_rating rating on o.order_id = rating.order_id and m.active_ind = 'A'
where m.active_ind = 'A' and m.chef_id = :chef_id group by m.menu_id`;
        return db.query(sql,{replacements:{chef_id:chef_id},type:db.QueryTypes.SELECT}).then(result => {
            return  locationService.baseFindByFilter(['district'],{chef:chef_id}).then(districtList => {
                result.chef_service_locations = districtList;
                return result;
            })
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

    cloneMenu(user_id, menu_id) {
        return chefService.getChefByUserId(user_id).then(chef => {
            if (chef){
               return this.getMenuWithoutItemsByCriteria({chef_id:chef.chef_id,menu_id:menu_id,act_ind:activeIndStatus.ACTIVE}).then(menu => {
                   if (!menu) throw baseResult.MENU_MENUID_NOT_BELONG_TO_CHEF;
                   console.log("clone menu:=============>",menu.toJSON());
                  return this.cloneProcess(menu.toJSON());
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
        return db.transaction(t => {
            // create new menu
            let last_menu_id = menu.menu_id;
            menu.menu_id = null;
            menu.menu_code = menu.chef_id+moment().format('YYYYMMDDHHmmSSSS')
            return this.baseCreate(menu,{transaction:t}).then(newMenu => {
                console.log("new menu============>",newMenu.toJSON());
                let new_menu_id = newMenu.menu_id;

                 // copy t_menu_item
                 return  menuItemService.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(items => {            let promiseArr = [];
                     items.forEach((item,index) => {
                         let createItemPromise = menuItemService.nextId('seq_no',{transaction:t}).then(nextSeqNo => {
                             let last_item_id = item.menu_item_id;
                             let oldItem = item.toJSON();
                             oldItem.seq_no = nextSeqNo+index;
                             oldItem.menu_id = new_menu_id;
                             oldItem.act_ind = activeIndStatus.ACTIVE;
                             oldItem.menu_item_id = null;
                             console.log("menu item =================>",oldItem);
                            return menuItemService.baseCreate(oldItem,{transaction:t}).then( resp => {
                                console.log("last_item_id=================>",last_item_id);
                                return menuItemOptionService.copyOptionsByItemId(last_item_id,resp.menu_item_id,t);
                            });
                         })
                         promiseArr.push(createItemPromise);
                     })
                     return Promise.all(promiseArr).then(result=> {
                         let otherPromiseArr = [];
                         //t_menu_cuisine
                         otherPromiseArr.push(this.copy(menuCuisineService,last_menu_id,new_menu_id,t));
                         // copy t_menu_kitchen_req
                         otherPromiseArr.push(this.copy(kitchenReqService,last_menu_id,new_menu_id,t));
                         // copy t_menu_include
                         otherPromiseArr.push(this.copy(menuIncludeService,last_menu_id,new_menu_id,t));
                         // copy t_menu_chef_note
                         otherPromiseArr.push(this.copy(menuChefNoteService,last_menu_id,new_menu_id,t));
                         //copy t_menu_booking_rule
                         otherPromiseArr.push(this.copy(menuBookingRuleService,last_menu_id,new_menu_id,t));
                         //copy t_menu_booking_requirement
                         otherPromiseArr.push(this.copy(menuBookingRequirementService,last_menu_id,new_menu_id,t));
                         // copy t_menu_extra_charge
                         otherPromiseArr.push(this.copy(menuExtraChargeService,last_menu_id,new_menu_id,t));
                         // copy  t_menu_photo
                         otherPromiseArr.push(this.copy(menuPhotoService,last_menu_id,new_menu_id,t));
                         return Promise.all(otherPromiseArr);
                     });


                 });
            })
        })
    }
    copy(service, last_menu_id,new_menu_id,t) {
        return service.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(list => {
            let copyList = [];
            list.forEach(single => {
                let  copyCuisine = single.toJSON();
                copyCuisine.menu_id = new_menu_id;
                copyList.push(copyCuisine);
            })
           return  service.baseCreateBatch(copyList,{transaction:t});
        })
    }
}
module.exports = new ChefMenuService()