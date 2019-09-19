
describe("Routes: user Login", () => {
    "use strict";
    let token;

    describe("GET /user/userLogin", () => {
        it("returns api access token", done => {
            request.get("/user/userLogin")
                .query({
                    username: "admin",
                    password: "123456",
                    IPv4_address:"192.168.1.100"
                })
                .expect(200)
                .end((err, res) => {
                    //expect(res.body).to.eql("0");
                    token = res.body.token_string;
                    done(err);
                });
        });
    });

    describe("POST /user/createUser", () => {
        it("returns create user result", done => {
            request.post("/user/createUser")
                .set('Accept', 'application/json')
                .send({
                    "user_name": "231"+new Date().getTime(),
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
    });

    describe("POST /user/updateUser", () => {
        it("returns user update result", done => {
            request.post("/user/updateUser")
                .set("access_token",`${token}`)
                .send({
                    "user_name": "admin",
                    "password": "123456",
                    "salutation": "test",
                    "first_name": "1",
                    "middle_name": "1",
                    "last_name": "1",
                    "email_address": "user@example2.com",
                    "contact_no": "112",
                    "sms_notify_ind": true,
                    "birthday": "2019-08-13",
                    "address_1": "add4",
                    "address_2": "addr5",
                    "address_3": "addr6",
                    "accept_marketing_ind": true,
                    "ipv4_address": "198.51.100.44",
                    "verified_email": true,
                    "verified_contact_no": true,
                    "active_ind": "A"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });



    describe("post /chef/createChef", () => {
        it("returns create chef result", done => {
            request.post("/chef/createChef")
                .send({
                    "user_name": "chef5"+new Date().getTime(),
                    "password": "123456",
                    "salutation": "12",
                    "first_name": "aa",
                    "middle_name": "bb",
                    "last_name": "cc",
                    "email_address": "use2r@example.com",
                    "contact_no": "11",
                    "sms_notify_ind": true,
                    "birthday": "2019-08-14",
                    "address_1": "add1",
                    "address_2": "addr2",
                    "address_3": "addr3",
                    "accept_marketing_ind": true,
                    "accept_terms_ind": true,
                    "robot_ind": true,
                    "ipv4_address": "198.51.100.42",
                    "photo_url": "http://xxx.jpg"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("post /chef/updateChef", () => {
        it("returns update chef result", done => {
            request.post("/chef/updateChef")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "password": "123456",
                    "salutation": "string",
                    "first_name": "ScottM2",
                    "middle_name": "ScottM2",
                    "last_name": "string",
                    "email_address": "user@example.com",
                    "contact_no": "string",
                    "sms_notify_ind": true,
                    "birthday": "2019-08-19",
                    "short_desc": "asdf",
                    "detail_description": "asdfa",
                    "address_1": "string",
                    "address_2": "string",
                    "address_3": "string",
                    "accept_marketing_ind": true,
                    "ipv4_address": "198.51.100.42",
                    "verified_email": true,
                    "verified_contact_no": true,
                    "Active_Ind": true,
                    "experience_list": [
                        {
                            "start_date": "2019-08-16T08:00:26.815Z",
                            "end_date": "2019-12-19T08:00:26.815Z",
                            "experience_description": "ep121"
                        },
                        {
                            "start_date": "2019-01-16T08:00:26.815Z",
                            "end_date": "2019-01-14T08:00:26.815Z",
                            "experience_description": "ep122"
                        },
                        {
                            "start_date": "2019-01-16T08:00:26.815Z",
                            "end_date": "2019-09-19T08:00:26.815Z",
                            "experience_description": "ep1221"
                        }
                    ],
                    "cuisine_type": [
                        {
                            "cuisine_type_id": "7"
                        }
                    ],
                    "verified_chef_ind": true,
                    "food_safety_certified_ind": true,
                    "payment_protection_ind": true
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("GET /chef/getChefDetailByChefId", () => {
        it("returns getChefDetailByChefId", done => {
            request.get("/chef/getChefDetailByChefId")
                .set("chef_id",1)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.chefUser.chef_id).to.eql(1);
                    done(err);
                });
        });
    });


    describe("GET /chef/getChefDetailByChefId", () => {
        it("returns getChefDetailByChefId", done => {
            request.get("/chef/getChefDetailByChefId")
                .set("chef_id",1)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.chefUser.chef_id).to.eql(1);
                    done(err);
                });
        });
    });


    describe("GET /chef/retrieveAvailTimeslots", () => {
        it("returns retrieveAvailTimeslots result", done => {
            request.get("/chef/retrieveAvailTimeslots")
                .query({chef_id:1})
                .set("access_token",`${token}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.chef_id).to.eql('1');
                    done(err);
                });
        });
    });

    describe("POST /chef/setupChefLanguage", () => {
        it("returns setupChefLanguage result", done => {
            request.post("/chef/setupChefLanguage")
                .set("access_token",`${token}`)
                .send({
                    "chef_id": 1,
                    "language_list": [
                        {
                            "lang_code": "bo",
                            "active_ind": "D"
                        },
                        {
                            "lang_code": "ja",
                            "active_ind": "A"
                        }

                    ]
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });



    describe("POST /chef/updateChefServiceLocation", () => {
        it("returns updateChefServiceLocation result", done => {
            request.post("/chef/updateChefServiceLocation")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "location_list": [
                        {
                            "district_code": "NO-MA",
                            "active_ind": "A"
                        },
                        {
                            "district_code": "SC-AG",
                            "active_ind": "A"
                        }
                    ]
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("POST /chef/updateChefServiceLocation", () => {
        it("returns updateChefServiceLocation result", done => {
            request.post("/chef/updateChefServiceLocation")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "location_list": [
                        {
                            "district_code": "NO-MA",
                            "active_ind": "A"
                        },
                        {
                            "district_code": "SC-AG",
                            "active_ind": "A"
                        }
                    ]
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });


    describe("POST /chef/updateChefQualification", () => {
        it("returns updateChefQualification result", done => {
            request.post("/chef/updateChefQualification")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "verified_chef_ind": true,
                    "food_safety_certified_ind": false,
                    "payment_protection_ind": true
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("POST /timeslot/updateChefAvailableTimeSlot", () => {
        it("returns updateChefAvailableTimeSlot result", done => {
            request.post("/timeslot/updateChefAvailableTimeSlot")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "available_timeslot_list": [
                        {
                            "start_date": "2019-08-19T01:11:53.863Z",
                            "end_date": "2019-08-19T01:11:53.863Z",
                            "instant_ind": true,
                            "available_meal": 2
                        },
                        {
                            "start_date": "2019-08-19T01:11:53.863Z",
                            "end_date": "2019-08-19T01:11:53.863Z",
                            "instant_ind": true,
                            "available_meal": 1
                        }
                    ]
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("POST /timeslot/updateChefUnAvailableTimeSlot", () => {
        it("returns updateChefUnAvailableTimeSlot result", done => {
            request.post("/timeslot/updateChefUnAvailableTimeSlot")
                .set("access_token",`${token}`)
                .send({
                    "chef_Id": 1,
                    "available_timeslot_list": [
                        {
                            "start_date": "2019-01-19T04:11:25.377Z",
                            "end_date": "2019-01-19T04:11:25.377Z",
                            "instant_ind": true,
                            "apply_meal": "2"
                        },
                        {
                            "start_date": "2019-01-19T04:11:25.377Z",
                            "end_date": "2019-01-19T04:11:25.377Z",
                            "instant_ind": true,
                            "apply_meal": "1"
                        },
                        {
                            "start_date": "2019-01-19T04:11:25.377Z",
                            "end_date": "2019-01-19T04:11:25.377Z",
                            "instant_ind": true,
                            "apply_meal": "3"
                        }
                    ]
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

    describe("POST /timeslot/updateChefDefaultTimeSlot", () => {
        it("returns updateChefDefaultTimeSlot result", done => {
            request.post("/timeslot/updateChefDefaultTimeSlot")
                .set("access_token",`${token}`)
                .send({
                    "chef_id": 1,
                    "mon": false,
                    "tue": true,
                    "wed": false,
                    "thu": false,
                    "fri": true,
                    "sat": true,
                    "sun": false,
                    "holiday": true,
                    "instant_ind": true,
                    "apply_meal": "2"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.code).to.eql(200);
                    done(err);
                });
        });
    });

///timeslot/updateChefDefaultTimeSlot
    //retrieveAvailTimeslots

});