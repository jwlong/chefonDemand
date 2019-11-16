import BaseService from './baseService.js'
import {AutoWritedMessage} from '../common/AutoWrite.js'
import cfg from '../config/index'
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
        entity.message_body_html = msgBody;
        return this.baseCreate(entity,options);
    }
}
module.exports = new MessageService()