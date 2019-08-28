import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import multipart from 'connect-multiparty'
import compression from 'compression'
import jwt from 'jsonwebtoken'
import cfg from './config/index'
import baseResult from './model/baseResult'
var userContext = require('./common/userContext')
import {apiRequestLogger} from './config/logger'
import utils from "./common/utils";

//配置express中间件
const app = express()
app.set('json spaces', 2)
//app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(multipart())
app.use(compression())
app.use(cookieParser())
app.use('/public', express.static('public'))

app.use(apiRequestLogger);
//关于auth
// 全局拦截配置CROS
app.all('*',function(req,res,next){
    console.log("Congratulations, you are in a secret area!")
	res.header('Access-Control-Allow-origin','*')
	res.header('Access-Control-Allow-Headers','accept, origin, X-Requested-With, content-type, token, access_token,userId')
	res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
	res.header('Content-Type','application/json;charset=utf-8')
	res.header('Access-Control-Allow-Credentials','true')
	next()
},authenticateRequest)

// 路由列表

app.use('/chef',require('./routes/chefCtrl'))
app.use('/user',require('./routes/userCtrl'))
app.use('/timeslot',require('./routes/timeslotCtrl'))
app.use(errorHandler);
if (!module.parent) {
    app.listen(config.port, function() {
        console.log(`app is listening at http://localhost:${config.port}`);
    });
}

function errorHandler(err, req, res, next) {
	console.error(err)
	res.json({error: err})
}

async function  authenticateRequest(req, res, next) {
    console.log(req.url);
    var token = req.body.access_token || req.query.access_token || req.headers.access_token || req.headers['x-access-token'] ;
    let isExcludeValidUrl = cfg.WHITE_LIST_URL.some(url =>{
        return (req.url.indexOf(url) >= 0 );
    });

    if (token) {
        try {
            await  utils.validToken(token,req);
            next();
        }catch (e) {
            next(e);
        }
        // Verification Code is invalid.
    } else {
        if (isExcludeValidUrl) return next();
        return res.json(baseResult.USER_VERITY_INVALID);
    }
}

// 错误处理中间件
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    res.json({error:err})
})

module.exports = app
