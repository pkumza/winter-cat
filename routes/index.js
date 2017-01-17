var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/appcat';

/* GET home page. */
router.get('/', function(req, res, next) {
    var findDocuments = function(db) {
        var collection = db.collection('packs');
        collection.find().toArray(function(err, docs){
            if (!err) {
                var packs = new Array()
                for(var doc in docs){
                    // console.log(docs[doc]);
                    if (docs[doc]["author1"] == '') {
                        packs[doc] = {"status":"btn-primary"};
                    } else if (docs[doc]["author2"] == ''){
                        packs[doc] = {"status":"btn-success"};
                    } else if (docs[doc]["author3"] == ''){
                        packs[doc] = {"status":"btn-warning"};
                    } else {
                        packs[doc] = {"status":"btn-danger"};
                    }
                    packs[doc]["pack_id"] = docs[doc]["pack_id"];
                }
                // console.log(packs)
                res.render('index', { title: 'Express', packs: packs });
            } else {
                console.log("Not Found");
            }
        });
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Database Connected correctly.");
        findDocuments(db);
    });
});

router.get('/packing', function(req, res, next) {
    var pack_id = req.query.pack_id;
    var name = req.query.name;
    var secret = req.query.secret;
    if (secret == undefined || secret.toUpperCase() != "YANXIN2017") {
        res.render('wrong_sec', {error_str: "抱歉，您没有权限。"});
        return;
    }

    var update_author = function(db) {
        var collection = db.collection('packs');
        collection.find({"pack_id": pack_id}).toArray(function(err, docs){
            if (err) {
                console.log("No data.");
                return;
            } else {
                console.log("DOCS");
                console.log(docs);
                if (docs[0].author1 == "") {
                    collection.update({"pack_id": pack_id},{$set:{"author1": name}});
                    // docs[0].author1 = name;
                } else if (docs[0].author2 == "") {
                    collection.update({"pack_id": pack_id},{$set:{"author2": name}});
                } else if (docs[0].author3 == "") {
                    collection.update({"pack_id": pack_id},{$set:{"author3": name}});
                } else {
                    collection.update({"pack_id": pack_id},{$set:{"author3": name}});
                    console.log("Too many author" + name + " pack: " + pack_id);
                }
            }
        })
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Database Connected correctly.");
        update_author(db);
    });
    console.log("name + " + name);
    var start = parseInt(pack_id) * 500;
    res.render('packing', {name: name, secret: secret, app_id: start});
});

router.get('/tagging', function(req, res, next) {
    var app_id = req.query.app_id;
    var name = req.query.name;
    var secret = req.query.secret;
    if (secret == undefined || secret.toUpperCase() != "YANXIN2017") {
        res.render('wrong_sec', {error_str: "抱歉，您没有权限。"});
        return;
    }
    var findDocuments = function(db) {
        var collection = db.collection('apps');
        collection.find({"app_id":app_id}).toArray(function(err, docs) {
            if (!err) {
                var app_info = new Array();
                if (docs[0] == undefined) {
                    res.render("wrong_sec", {error_str: "抱歉，没找到相应的应用信息。"});
                    return;
                }
                app_info['app_name'] = docs[0].app_name;
                app_info['package_name'] = docs[0].package_name;
                app_info['tags'] = docs[0].tags;
                app_info['png'] = docs[0].png;
                app_info['description'] = docs[0].description;
                app_info['app_id'] = docs[0].app_id;
                app_info['official_category'] = docs[0].official_categories;
                console.log(app_info);
                res.render('tagging', {app_info: app_info});
            } else {
                console.log("Error, Not found.");
            }
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Database Connected correctly.");
        findDocuments(db);
    });
});

router.get('/insert', function(req, res, next) {
    var app_id = req.query.app_id;
    var name = req.query.name;
    var secret = req.query.secret;
    var cate_res =  req.query.res;
    var insertDocuments = function(db) {
        var collection = db.collection('apps');
        collection.find({"app_id":app_id}).toArray(function(err, docs) {
            if (!err) {
                if (docs[0].author1 == "") {
                    collection.update({"app_id": app_id}, {$set: {"author1" : name, "cate1": cate_res}});
                } else if (docs[0].author2 == ""){
                    collection.update({"app_id": app_id}, {$set: {"author2" : name, "cate2": cate_res}});
                } else {
                    collection.update({"app_id": app_id}, {$set: {"author3" : name, "cate3": cate_res}});
                }
            } else {
                console.log("Error, Not found.");
            }
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Database Connected correctly.");
        insertDocuments(db);
    });
    if (parseInt(app_id) + 1 == 23402 || (parseInt(app_id) + 1) % 500 == 0){
        res.render('wrong_sec', {error_str: "你已经完成了一个pack，退出或者返回主页。"});
    } else {
        res.render('insert', {
            next_id: (parseInt(app_id) + 1).toString(),
            name: name,
            secret: secret
        });
    }
})

router.get('/template', function(req, res, next) {
    res.render('template', { title: 'Express' });
});

module.exports = router;
