import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import multipart from 'connect-multiparty'
import compression from 'compression'
import jwt from 'jsonwebtoken'
const WHITE_LIST_URL = ["/user/userLogin",'/user/createUser'];

//配置express中间件
const app = express()
app.set('json spaces', 2)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(multipart())
app.use(compression())
app.use(cookieParser())
app.use('/public', express.static('public'))


//关于auth
// 全局拦截配置CROS
app.all('*',authenticateRequest,function(req,res,next){
    console.log("Congratulations, you are in a secret area!")
	res.header('Access-Control-Allow-origin','*')
	res.header('Access-Control-Allow-Headers','accept, origin, X-Requested-With, content-type, token, userId')
	res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
	res.header('Content-Type','application/json;charset=utf-8')
	res.header('Access-Control-Allow-Credentials','true')
	next()
})

// 路由列表
app.use('/chef',require('./routes/chefCtrl'))
app.use('/user',require('./routes/userCtrl'))

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

function authenticateRequest(req, res, next) {
    console.log(req.url);
    if (!WHITE_LIST_URL.includes(req.url) ) {
        if ( req.headers.access_token) {
            let decoded = jwt.decode(req.headers.access_token);
            if (decoded && decoded.id) {
                return next();
            }else {
                res.status(401);
            }
        }else {
            res.status(401);
        }
    }
    return next();
}

// 错误处理中间件
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    res.status(404).json({error:err})
})

module.exports = app
