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

    USER_NAME_ALREADY_TOKEN:new baseResult(400,"user name already taken."),
    USER_MANDATORY_FIELD_EXCEPTION: new baseResult(401,"user first name, last name, password,email address and contact no. fields are mandatory."),
    USER_TERMS_EXCEPTION:new baseResult(402,"user must accept terms and conditions."),
    USER_NOT_ACCEPT_ROBOT:new baseResult(403,"system does not accept robot."),

    USER_VERITY_INVALID:new baseResult(421,'Verification Code is invalid.'),
    USER_VERITY_EXPIRED:new baseResult(422,'Verification Code expired.'),

    //chef部分
    CHEF_NAME_ALREADY_TOKEN:new baseResult(400,"user name already taken."),
    CHEF_MANDATORY_FIELD_EXCEPTION:new baseResult(401,'Chef\'s first name, last name and short description fields are mandatory.'),
    CHEF_USER_ID_NOT_EXIST: new baseResult(400,"user Id does not exist."),
    CHEF_LANG_LIST_EMPTY:new baseResult(401,"language list can not be empty."),
    CHEF_ID_NOT_EXIST: new baseResult(400,'chef Id does not exist.'),

    // /chef/updateChefServiceLocation
    CHEF_DISTRICT_CODE_NOT_EXIST:new baseResult(401,"district code does not exist."),
    CHEF_DISTRICT_LIST_EMPTY:new baseResult(401,"district list can not be empty."),


    // time slot
    TIMESLOT_CHEF_ID_NOT_FOUND : new baseResult(402,"Chef Not Found."),
    TIMESLOT_LIST_EMPTY:new baseResult(400,'Timeslot List is Empty'),
    TIMESLOT_INVALID_DATETIME:new baseResult(407,"Timeslot start datetime can not later than end datetime."),
    TIMESLOT_PICK_ERROR:new baseResult(420,'Must pick at least one day of the week.'),


    //menu部分
    MENU_ID_NOT_EXIST:new baseResult(400,'menu Id does not exist.'),
    MENU_ID_FILED_MANDATORY:new baseResult(401,'menu_id field is mandatory.'),
    MENU_ONLY_CHEF_CAN_CREATE_MENU:new baseResult(402,'Only chef can create menu.'),
    MENU_ONLY_CHEF_CAN_DO_THIS:new baseResult(402,'Only chef can perform this operation.'),
    MENU_ONLY_CHEF_CAN_ADD_SECTION:new baseResult(402,'Only chef can add new menu section.'),
    MENU_NAME_AND_DESC_REQUIRED:new baseResult(401,'Menu name, description, are mandatory,'),
    MENU_NAME_EXISTS:new baseResult(400,'Menu name already taken for the chef.'),
    MENU_CHEF_ID_NOT_EXISTS: new baseResult(400, 'chef Id does not exist.'),
    MENU_MENUID_TOKEN_CONTENT_TYPE_MANDATORY:new baseResult(401,'access_token, content_type, menu_id, menu json fields are mandatory.'),
    MENU_MENUID_NOT_BELONG_TO_CHEF:new baseResult(403,'menu Id does not belong to chef.'),
    MENU_CHEF_MUST_BE_ACTIVE:new baseResult(403,'Can only add menu section for active chef.'),
    MENU_SECTION_NAME_EXISTS:new baseResult(401,'Menu heading section name already exist.'),
    MENU_SECTION_ID_NOT_BELONG_CHEF:new baseResult(404,'the menu_section_id does not belong to chef.'),
    MENU_SECTION_ID_NOT_EXISTS:new baseResult(401,'menu_section_id does not exist.'),
    MENU_FOOD_ITEM_NAME_EXIST:new baseResult(401,'Menu food item name already exist.'),
    MENU_FOOD_ITEM_ID_NOT_BELONG_TO_CHEF:new baseResult(404,'the food_item_id does not belong to chef'),
    // 未定义错误
    PASSWD_NOT_BE_EMPTY:new baseResult(999,"password can not be empty!"),
    CHEF_EXP_LIST_FILED_INVALID: new baseResult(998,"in experience_list ,start_date,exp_desc are mandatory!"),


};
