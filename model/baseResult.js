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
    MENU_ONLY_CHEF_CAN_CREATE_MENU:new baseResult(402,'Only chef can create menu.'),
    MENU_NAME_AND_DESC_REQUIRED:new baseResult(401,'Menu name, description, are mandatory,'),
    MENU_NAME_EXISTS:new baseResult(400,'Menu name already taken for the chef.'),


    // 未定义错误
    PASSWD_NOT_BE_EMPTY:new baseResult(999,"password can not be empty!"),
    CHEF_EXP_LIST_FILED_INVALID: new baseResult(998,"in experience_list ,start_date,exp_desc are mandatory!"),


};
