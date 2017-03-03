/**
 * Created by lenovo on 2017/3/2.
 */
var fs = require("fs");

var _GetCBJsonFile = function (req, res, next) {
    var m_FileName = req.params.fullname;
    if (m_FileName.toString().indexOf('cb') > 0) {
        var data = fs.readFileSync("./resource/" + m_FileName, 'utf-8');
        console.log(data);
        var jsonData = JSON.stringify(data);
        res.end(data);
        next();
    }
    else {
        res.end("");
        next();
    }
};
exports._GetCBJsonFile = _GetCBJsonFile;

//testFS();

function testFS() {
    var iconv = require('iconv-lite');
    var m_FileName = "CLM_0_1.cb";
    fs.readFile("../resource/" + m_FileName, 'utf-8', function (err, data) {
        if (data) {
            console.log(data);
        }
    });
}