/**
 * Created by lenovo on 2017/3/1.
 */
(function () {
    var restify = require('restify');
    var commonFunc = require('./lib/shkutil');

    var port = (process.argv[2]) ? process.argv[2] : 4005;
    var dateReg = /[0-9]{4,5}/;
    if (!dateReg.test(port)) {
        port = 3002;
    }
    var localIP = commonFunc.getLoacalIP();

    var server = restify.createServer({
        name: 'paleete_server'
    });
    server.use(restify.queryParser());
    server.use(restify.CORS());
    server.use(
        function crossOrigin(req, res, next) {
            'use strict';
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        });

    var cbmodule = require('./module/cbfile_module');

    // datastatusFuncSta._TimingCalculation();
    /**
     *  获取火点信息
     */
    server.get({path: '/cbjson/:fullname', version: '0.0.1'}, cbmodule._GetCBJsonFile);


    server.listen(port, localIP, function () {
        console.log('%s listening at %s ', server.name, server.url);
    });


})();