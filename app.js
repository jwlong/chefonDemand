import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import multipart from 'connect-multiparty'
import compression from 'compression'
var OAuth2Server = require('oauth2-server')
var Request = OAuth2Server.Request;
var Response = OAuth2Server.Response;


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

app.oauth = new OAuth2Server({
    model: require('./model/authModel.js'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

//关于auth
app.all('/oauth/token', obtainToken);
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
app.use('/system',require('./routes/systemCtrl'))
app.use('/staff',require('./routes/adminStaffCtr'))



// 错误处理中间件
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  res.json({error:err})
})
app.use(errorHandler);
function errorHandler(err, req, res, next) {
	console.error(err)
	res.json({error: err})
}

function obtainToken(req, res) {
    var request = new Request(req);
    var response = new Response(res);
    return app.oauth.token(request, response)
        .then(function(token) {

            res.json(token);
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
}

function authenticateRequest(req, res, next) {
    /*if (req.headers.authorization && req.headers.authorization.indexOf("Bearer") == -1) {
        req.headers.authorization = "Bearer "+ req.headers.authorization;
    }*/
    var request = new Request(req);
    var response = new Response(res);

    return app.oauth.authenticate(request, response)
        .then(function(token) {

            next();
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
}


module.exports = app
