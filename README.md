config 目录 index.js  配置Mysql,以及server 连接信息
-- 
安装依赖库
- npm install
运行服务器 
- npm start
/ **npm run dev(开发模式new)** 

user 部分

默认的配置请求 **更多内容请查看(chefOnDemand_part1.yaml)**

post:
{
  "user_name": "string",
  "password": "string",
  "salutation": "string",
  "first_name": "string",
  "middle_name": "string",
  "last_name": "string",
  "email_address": "user@example.com",
  "contact_no": "string",
  "SMS_notify_ind": true,
  "birthday": "2019-08-13",
  "address_1": "string",
  "address_2": "string",
  "address_3": "string",
  "accept_marketing_ind": true,
  "accept_terms_ind": true,
  "robot_ind": true,
  "IPv4_address": "198.51.100.42"
}

http://localhost:3333/user/createUser
返回
Code	Description
200	
successful operation
400	
user name already taken.
401	
user first name, last name, email address and contact no. fields are mandatory.

402	
user must accept terms and conditions.
403	
system does not accept robot.



--------------

get请求
param 
username:"string", (required)
password:"string", (required)
IPv4_address:"string" (required)

http://localhost:3333/user/userLogin

返回
{
  "access_status": "string",
  "access_token": "string"
}
400	
Invalid username/password supplied

401	
IPv4_address must be supplied

--------------------------------------


3. post 请求 /user/updateUser
Name	      Description
access_token *
string
(header)	
content-type *
string
(header)	
Default value : application/json

body:
{
  "user_name": "string",
  "password": "string",
  "salutation": "string",
  "first_name": "string",
  "middle_name": "string",
  "last_name": "string",
  "email_address": "user@example.com",
  "contact_no": "string",
  "SMS_notify_ind": true,
  "birthday": "2019-08-13",
  "address_1": "string",
  "address_2": "string",
  "address_3": "string",
  "accept_marketing_ind": true,
  "IPv4_address": "198.51.100.42",
  "verified_email": true,
  "verified_contact_no": true,
  "Active_Ind": true
}
http://localhost:3333/user/updateUser
返回 
Code	Description
200	
successful operation
401	
user first name, last name, email address and contact no. fields are mandatory.

421	
Verification Code is invalid.
422	
Verification Code expired.






