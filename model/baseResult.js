class baseResult {

    constructor(code,msg,data) {
        this.code = code;
        this.msg = msg;
        this.data = data
    }
    setCode(code) {
        this.code = code;
    }
    getCode() {
        return this.code;
    }
    setMsg(msg) {
        this.msg = msg;
    }
    getMsg() {
        return this.msg;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }

    getResult() {
        return {'code':this.code,'msg':msg,'data':data};
    }
}
//export  default baseResult;

export default  {
    SUCCESS:new baseResult(200, "successful operation"),
    // user 部分
    USER_INVALID_NAME_PASSWD:new baseResult(400,"Invalid username/password supplied"),
    USER_IPV4_ERROR:new baseResult(401,"IPv4_address must be supplied"),
    USER_REFRESH_TOKEN_MUST_BE_SUPPLIED:new baseResult(402,'refresh_token must be supplied'),
    USER_NAME_ALREADY_TOKEN:new baseResult(400,"user name already taken."),
    USER_MANDATORY_FIELD_EXCEPTION: new baseResult(401,"user first name, last name, password,email address and contact no. fields are mandatory."),
    USER_TERMS_EXCEPTION:new baseResult(402,"user must accept terms and conditions."),
    USER_NOT_ACCEPT_ROBOT:new baseResult(403,"system does not accept robot."),

    USER_VERITY_INVALID:new baseResult(421,'Verification Code is invalid.'),
    USER_VERITY_EXPIRED:new baseResult(422,'Verification Code expired.'),
    USER_GRANT_TYPE_MUST_BE_REFRESH_TOKEN:new baseResult(999,"grant type must be 'refresh_token' "),
    USER_LOGOUT_ONLY_ACTIVE:new baseResult(402,'Only active valid user can logout from system.'),
    //chef部分
    CHEF_NAME_ALREADY_TOKEN:new baseResult(400,"user name already taken."),
    CHEF_MANDATORY_FIELD_EXCEPTION:new baseResult(401,'Chef\'s first name, last name and short description fields are mandatory.'),
    CHEF_USER_ID_NOT_EXIST: new baseResult(400,"user Id does not exist."),
    CHEF_LANG_LIST_EMPTY:new baseResult(401,"language list can not be empty."),
    CHEF_EXIST_INVALID_IN_LANG_LIST:new baseResult(402,"One of the language in input list is invalid."),
    CHEF_ID_NOT_EXIST: new baseResult(400,'chef Id does not exist.'),
    CHEF_ONE_OF_LANG_INVALID:new baseResult(402, 'one of language code is invalid.'),
    CHEF_ONE_OF_CUSITYPE_INVALID:new baseResult(403, 'one of cuisine type code is invalid.'),
    CHEF_ONE_OF_DISTRICT_INVALID:new baseResult(404, 'one of district code is invalid.'),




    // /chef/updateChefServiceLocation
    CHEF_DISTRICT_CODE_NOT_EXIST:new baseResult(401,"district code does not exist."),
    CHEF_DISTRICT_LIST_EMPTY:new baseResult(401,"district list can not be empty."),


    // time slot
    TIMESLOT_CHEF_ID_NOT_FOUND : new baseResult(402,"Chef Not Found."),
    TIMESLOT_LIST_EMPTY:new baseResult(400,'Timeslot List is Empty'),
    TIMESLOT_INVALID_DATETIME:new baseResult(407,"Timeslot start datetime can not later than end datetime."),
    TIMESLOT_STARTDATE_EARLY_TODAY:new baseResult(408, 'Timeslot start datetime can not backdate (earlier than today)'),
    TIMESLOT_PICK_ERROR:new baseResult(420,'Must pick at least one day of the week.'),
    TIMESLOT_CHEF_NOT_FOUND:new baseResult(402,'Chef Not Found'),


    //menu部分
    MENU_ID_NOT_EXIST:new baseResult(400,'menu Id does not exist.'),
    MENU_ID_FILED_MANDATORY:new baseResult(401,'menu_id field is mandatory.'),
    MENU_ONLY_CHEF_CAN_CREATE_MENU:new baseResult(402,'Only chef can create menu.'),
    MENU_ONLY_CHEF_CAN_UPDATE:new baseResult(402,'Only chef can update menu.'),
    MENU_ONLY_CHEF_CAN_DO_THIS:new baseResult(402,'Only chef can perform this operation.'),
    MENU_ONLY_CHEF_CAN_ADD_SECTION:new baseResult(402,'Only chef can add new menu section.'),
    MENU_NAME_AND_DESC_REQUIRED:new baseResult(401,'Menu name, description, are mandatory,'),
    MENU_NAME_EXISTS:new baseResult(400,'Menu name already taken for the chef.'),
    MENU_NAME_FIELD_MANDATORY:new baseResult(401,'Menu name, description, are mandatory.'),
    MENU_CHEF_ID_NOT_EXISTS: new baseResult(400, 'chef Id does not exist.'),
    MENU_MENUID_TOKEN_CONTENT_TYPE_MANDATORY:new baseResult(401,'access_token, content_type, menu_id, menu json fields are mandatory.'),
    MENU_MENUID_NOT_BELONG_TO_CHEF:new baseResult(403,'menu Id does not belong to chef.'),
    MENU_CHEF_MUST_BE_ACTIVE:new baseResult(403,'Can only add menu section for active chef.'),
    MENU_SECTION_NAME_EXISTS:new baseResult(401,'Menu heading section name already exist.'),
    MENU_SECTION_ID_NOT_BELONG_CHEF:new baseResult(404,'the menu_section_id does not belong to chef.'),
    MENU_SECTION_ID_NOT_EXISTS:new baseResult(401,'menu_section_id does not exist.'),
    MENU_FOOD_ITEM_NAME_EXIST:new baseResult(401,'Menu food item name already exist.'),
    MENU_FOOD_ITEM_ID_NOT_BELONG_TO_CHEF:new baseResult(404,'the food_item_id does not belong to chef'),
    MENU_FOOD_ITEM_ID_NOT_EXISTS:new baseResult(401,'food_item_id does not exist.'),


    // menu review
    MENU_ONLY_REGULAR_USER_CAN_DO:new baseResult(402,' Only regular user (non-chef) can add menu review.'),
    MENU_CAN_OLNY_ADD_ACTIVE_MENU:new baseResult(403," Can only add menu review for active menu."),
    MENU_ONLY_CHEF_CAN_MODIFY:new baseResult(402,'Only chef can modify menu.'),

    // 未定义错误
    PASSWD_NOT_BE_EMPTY:new baseResult(999,"password can not be empty!"),
    CHEF_EXP_LIST_FILED_INVALID: new baseResult(998,"in experience_list ,start_date,exp_desc are mandatory!"),



    MENU_START_DATE_ERROR:new baseResult(400,'start_date can not be earlier than today.'),
    MENU_END_DATE_MUST_AFTER_START_DATE:new baseResult(401,'end_date must be => start_date.'),
    MENU_LANGUAGE_CODE_LIST_INVALID:new baseResult(402,'one of language code is invalid.'),
    MENU_CUISINE_TYPE_LIST_INVALID:new baseResult(403,'one of cuisine type code is invalid.'),
    MENU_DISTRICT_CODE_INVALID:new baseResult(404,'one of district code is invalid.'),
    MENU_NO_CHANGE_AVAILABILITY:new baseResult(403,'No change to menu\'s availability.'),
    PAGE_NUMBER_INVALID:new baseResult(405,'page number is invalid'),

    MENU_QUERY_PARAM_MANDATORY:new baseResult(401,'access_token, content_type, menu_id, menu json fields are mandatory.'),

    // order
    ORDER_USER_INVALID:new baseResult(999,'user_id is a not a valid active user, then he is not allow to place an order.'),
    ORDER_ONLY_ACTIVE_USER_CANCEL:new baseResult(402,'Only valid active user can cancel his order.'),
    ORDER_NOT_BELONG_USER:new baseResult(401,'Order does not belong to user.'),
    ORDER_USER_ONLY_ACTIVE_GUEST:new baseResult(402,'Only valid active user can enter guest list.'),
    ORDER_ONLY_PUBLIC_MENU_CAN_CREATED:new baseResult(400,'Only public menu can be used to create orders.'),
    ORDER_MUSE_BE_PLACED_BEFORE_PREORDER_DATE:new baseResult(401,'Order must be placed before preorder date.'),
    //
    ORDER_SECTION_USER_ONLY_ACTIVE_GUEST:new baseResult(400,'Only active guest can update order selection.'),
    ORDER_SECTION_GUEST_LIST_INVALID:new baseResult(401,'Only active order before preparation days is allowed to update guest order selection.'),
    ORDER_CANCEL_WITHIN_HOURS:new baseResult(403,'Can only cancel within cancelling hours.'),
    ORDER_ONLY_CHEF_AND_USER_CAN_VIEW:new baseResult(402,'Only chef and user can view his orders.')

};
