var url = require("url");
var merge = require("merge");

var router = {};
var serverConfig = require("../server.json");
// 指示是否启动登录校验。
var VALIDATE_LOGIN = true;

/**
 * string-function|object
 * function: see object handler
 * object {
 *      type: html(default) | json,
 *      method: get(default) | post
 *      handler: function(req, res)
 * }
 * @type {{/: indexController, /index.html: indexController, detail.html: {handler: detailController}}}
 */
var htmlPath = {
    "/": indexController,
    "/index.html": indexController,
    "/list.html" : listController
};
var codePath = {
    "NOT_LOGIN" : {
        code: -100,
        message: "当前用户未登录！"
    },
    "FAIL": {
        code: -1,
        message: "操作失败！"
    },
    "SUCCESS" : {
        code: 1,
        message: "操作成功！"
    },
    "LOGIN_SUCCESS" : {
        code: 100,
        message: "登录成功！"
    }
};

router.register = function(app){
    app.use(function(req, res, next){
        if(!VALIDATE_LOGIN){
            next();
        }
        else{
            var type = isIntercept(req);
            if(type == "json"){
                res.json(codePath["NOT_LOGIN"]);
            }
            else if(type=="html"){
                res.redirect("/login.html?url=" + encodeURIComponent(req.url))
            }
            else{
                next();
            }
        }
    });
    var key, value;
	for(key in htmlPath){
        value = htmlPath[key];
        if(typeof(value)=="function"){
            app.get(key, value);
        }
        else if(typeof(value)=="object" && typeof(value.handler)){
            if(value.method=="post"){
                app.post(key, value.handler);
            }
            else{
                app.get(key, value.handler);
            }
        }
    }

    app.get("/login.html", login1);
    app.post("/doLogin.html", login2);
};
function indexController(req, res){
    res.render("index", getServerConfig());
}
function listController(req, res){
    var obj = {message: req.param("message")};
    res.render("list", getServerConfig(obj));
}
function login1(req, res){
    res.render("login", getServerConfig());
}
function login2(req, res){
    var username = "", password = "";
    var ret = "";
    var obj = {};
    if(req.body){
        username = req.body.username;
        password = req.body.password;
        if(req.session){
            req.session.username = username;
            req.session.password = password;
        }
    }
    if(username && password){
        if(req.session){
            req.session.uid = username;
        }
        res.json(codePath["LOGIN_SUCCESS"])    
    }
    else{
        res.json(codePath["FAIL"]);
    }
}
function isIntercept(req){
    var pp = url.parse(req.url).pathname;
    var value = htmlPath[pp];
    if(value){
        if(req.session && req.session.uid){
            return "";
        }
        if(typeof(value)=="function"){
            return "html";
        }
        else if(typeof(value)=="object"){
            return value.type || "html";
        }
    }
    return "";
}
function getServerConfig(obj){
    return merge({}, {server: serverConfig}, obj);
}




module.exports = router;
