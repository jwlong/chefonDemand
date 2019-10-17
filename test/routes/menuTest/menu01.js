describe("Routes: user Login", () => {
    "use strict";
    let token = '65981300-2bcf-44f8-853a-b9e2559c589f';
    let user_name = "test1568819681689"
/*    describe("POST /user/createUser", () => {
        it("returns create user result", done => {
            request.post("/user/createUser")
                .set('Accept', 'application/json')
                .send({
                    "user_name": user_name,
                    "password": "123456",
                    "salutation": "1",
                    "first_name": "1",
                    "middle_name": "1",
                    "last_name": "1",
                    "email_address": "user@example.com",
                    "contact_no": "1",
                    "sms_notify_ind": true,
                    "birthday": "2019-08-21",
                    "address_1": "add1",
                    "address_2": "addr2",
                    "address_3": "addr3",
                    "accept_marketing_ind": true,
                    "accept_terms_ind": true,
                    "robot_ind": false,
                    "ipv4_address": "198.51.100.42"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });*/
/*    describe("GET /user/userLogin", () => {
        it("returns api access token", done => {
            request.get("/user/userLogin")
                .query({
                    user_name: user_name,
                    password: "123456",
                    IPv4_address: "192.168.1.100"
                })
                .expect(200)
                .end((err, res) => {
                    console.log("test=============>")
                    //expect(res.body).to.eql("0");
                    token = res.body.token_string;
                    done(err);
                });
        });
    });*/
    describe("get /menu/getMenuByMenuId", () => {
        it("returns chef menu result", done => {
            request.get("/menu/getMenuByMenuId")
                .set("access_token",`${token}`)
                .query({menu_id:30001})
                .expect(200)
                .end((err, res) => {
                    console.log("body=====>",res.body);
                  //  expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("get /menu/getMenuByMenuId", () => {
        it("returns chef menu result", done => {
            request.get("/menu/getMenuByMenuId")
                .set("access_token",`${token}`)
                .query({menu_id:30001})
                .expect(200)
                .end((err, res) => {
                    console.log("body=====>",res.body);
                    //  expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

})

