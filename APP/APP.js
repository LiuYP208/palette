/**
 * Created by lenovo on 2017/3/8.
 */
(function () {

    'use strict';
    var express = require('express');
    var path = require('path');
    var morgan = require('morgan');
    var onFinished = require('on-finished');

    var app = express();


    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var unless = require('express-unless');
    app.use(morgan('dev'));
    console.log(path.join(__dirname, './'));
    app.use(express.static(path.join(__dirname, './')));
    /*app.use(express.static(path.join(__dirname, './app/publics')));*/
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.get('/FY4A_palette_demo', function (req, res) {
        res.sendfile('ProList_demo.html');
    });
    app.use('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        if (req.method == "OPTIONS")
            res.send(200); //让options请求快速返回
        else
            next();
    });
    app.use(function (req, res, next) {
        onFinished(res, function (err) {
            //  debug("[%s] finished request", req.connection.remoteAddress);
        });
        next();
    });
    // app.use("/", require('./routes/user.js')());
    app.all("*", function (req, res, next) {
        next(new Error("404"));
    });

    // debug("Creating HTTP server on port: %s", 4000);
    require('http').createServer(app).listen(8088, function () {
        // debug("HTTP Server listening on port: %s, in %s mode", 8088, app.get('env'));
    });
})();