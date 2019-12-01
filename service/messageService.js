import BaseService from './baseService.js'
import {AutoWritedMessage} from '../common/AutoWrite.js'
import cfg from '../config/index'
import userMdel from  '../model/user'
import stringFormat from 'string-format';
import msgCfg from "../common/messgeConf";
const subject = "Menu updated Notification"


@AutoWritedMessage
class MessageService extends BaseService{
    constructor(){
        super(MessageService.model)
    }

    insertMessage (user_id,msgBody,options) {
        let entity = {};
        entity.subject = subject;
        entity.from_user_id = cfg.sys_user_id;
        //entity.parent_message_id =
        entity.sys_message_ind =1;
        entity.to_user_id = user_id;
        entity.read_ind=0;
        entity.message_body_html = msgBody;
        return this.baseCreate(entity,options);
    }

    insertMessageByOrderList(orderList, attrs,t) {
        let promiseArr = [];
        orderList.forEach( order => {
            let p = userMdel.getById(order.user_id,t).then( user =>{
                let notity_username = user.first_name+" "+user.last_name;
                let msgBody = stringFormat(msgCfg.update_menu_notify,attrs.menu_code,notity_username);
                return this.insertMessage(order.user_id,msgBody,{transaction:t});
            });
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }
}
module.exports = new MessageService()