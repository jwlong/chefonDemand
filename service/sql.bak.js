var chefDetail = {};
chefDetail.language_code_list = [];
chefDetail.cuisine_type = [];
chefDetail.experience_list = [];

var sql = `SELECT chef.chef_id ,
             user.user_Id 'user_Id',
             user.password 'password',
             user.salutation 'salutation',
             user.first_name 'first_name',
             user.middle_name 'middle_name ',
             user.last_name 'last_name',
             user.email_address  'email_address ',
         user.contact_no as 'contact_no',
         user.SMS_notify_ind as 'SMS_notify_ind',
         user.birthday as 'birthday',
         chef.short_desc as 'short_description',
         chef.detail_desc as 'detail_description',
             user.address_1 'address_1',
             user.address_2 'address_2',
             user.address_3 'address_3',
             user.accept_marketing_ind 'accept_marketing_ind',
             user.IPv4_address 'IPv4_address',
             user.verified_email 'verified_email',
             user.verified_contact_no 'verified_contact_no',
             user.Active_Ind 'Active_Ind',
             language_code_list.lang_code,
             cuisine_type.cuisine_type_id,
             experience_list.start_date,experience_list.end_date,experience_list.exp_desc as  experience_description
         FROM t_chef  chef
         left JOIN t_user user on user.user_id = chef.user_id
         LEFT JOIN t_chef_language language_code_list on language_code_list.chef_id = chef.chef_id
         LEFT JOIN t_chef_experience experience_list  ON experience_list.chef_id = chef.chef_id
         LEFT JOIN t_chef_cuisine cc on cc.chef_id = chef.chef_id
         LEFT JOIN t_cuisine_type cuisine_type on cuisine_type.cuisine_type_id =  cc.cuisine_type_id
         WHERE chef.chef_id = :chef_id`;
return db.query(sql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT}).then(list => {
    if (list.length >0 ) {
        list.forEach((obj,index) => {
            if (index === 0) {
                console.log("obj=====>",obj);
                chefDetail
            }
            if (obj.lang_code) {
                chefDetail.language_code_list.push(obj.lang_code);
            }
        })
    }
    return list
});

/**
 * Created by aa on 2019/8/18.
 */
-------------

/*
 getChefDetailByChefId(chefId) {
 // var sql = "select ";
 return this.getModel().findAll({
 include:[{
 model:chefLanguage['model'],
 },{
 model:user['model'],
 },{
 model:cuisineType['model'],
 //as:'cuisine_type'
 },{
 model:experience['model'],
 //as: 'experience_list'
 }],
 where:{chef_id:chefId}
 })
 }
 */