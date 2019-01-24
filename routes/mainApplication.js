
var express = require("express");
var http = require("http");
var path = require("path");
var app = express();
var request = require("request")
var bodyParser = require("body-parser");
var morgan = require("morgan");
var router = express.Router();
var domain = require('express-domain-middleware');
router.use(domain);

var yKey = process.env.NODE_YKEY;
var rKey = process.env.NODE_RKEY;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use("/static", express.static(path.join(__dirname,"static")));
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/mainApplication', function(req, res, next) {
    console.log(req.user)
    res.render('application', { user : req.user });
  });

router.post("/form", function(req, res) {
    console.log(req);
    if(req.body.sentence=="") {
        res.send(JSON.stringify("Error: 入力がありません"));
    } else if(/^\s+$/.test(req.body.sentence)){
        res.send(JSON.stringify("Error: スペースのみでの検索はできません"));
    } else if(req.body.sentence.length>128){
        res.send(JSON.stringify("Error: 128文字以内で入力してください"));
    } else {
        request.get({
            url: "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706",
            qs: {
                applicationId: rKey,
                keyword: req.body.sentence,
            }
        }, function(error,response,body){
        var analysisResultR = JSON.parse(body);
        console.log(analysisResultR);
        var resultArrayR = [];
        
        // 該当商品が無かった場合の処理
        if(analysisResultR["Items"][0]==undefined) {
            resultArrayR[0] = "Error:このキーワードでヒットする商品がありません。";
            res.send(JSON.stringify(resultArrayR[0]));
            return;
        }

        // 検索でヒットした商品のタイトルを配列に格納
        for(var i=0; i<30; i++){    
            resultArrayR.push(analysisResultR["Items"][i]["Item"]["itemName"]);
            // 検索結果が30商品に満たなかった場合の処理
            if(analysisResultR["Items"][i+1] == undefined) break;
        }
        // 配列に格納した商品タイトルを文字列に変換
        var resultOutputR = resultArrayR.join("");
        var analysis = request.post({
            url: "https://jlp.yahooapis.jp/KeyphraseService/V1/extract",
            headers: {
                "content-type": "application/json"
            },
            form: {
                appid: yKey,
                sentence: resultOutputR,
                output: "json"
            }
        }, function(error, response, body){
            res.send(JSON.parse(body));
        }); 
    });
    }
});

module.exports = router;
