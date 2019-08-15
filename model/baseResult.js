class baseResult {

    constructor(code,msg) {
        this.code = code;
        this.msg = msg;
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

    getResult() {
        return {'code':this.code,'msg':msg};
    }
}
export  default baseResult;
