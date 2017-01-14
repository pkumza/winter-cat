var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/appcat';

/* GET home page. */
router.get('/', function(req, res, next) {
    var findDocuments = function(db) {
        var collection = db.collection('packs');
        console.log(collection.find().count());
        var counts = "";
        collection.find().toArray(function(err, docs){
            if (!err) {
                packs = new Array()
                for(doc in docs){
                    // console.log(docs[doc]);
                    if (docs[doc]["author1"] == '') {
                        packs[doc] = {"status":"btn-primary"};
                    } else if (docs[doc]["author2"] == ''){
                        packs[doc] = {"status":"btn-success"};
                    } else if (docs[doc]["author3"] == ''){
                        packs[doc] = {"status":"btn-warning"};
                    } else {
                        packs[doc] = {"status":"btn-error"};
                    }
                    packs[doc]["pack_id"] = docs[doc]["pack_id"];
                }
                console.log(packs)
                res.render('index', { title: 'Express', packs: packs });
            } else {
                console.log("Not Found");
            }
        });
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        findDocuments(db);
    });
});

router.get('/tagging', function(req, res, next) {
    res.render('tagging', { title: 'Express' });
});

router.get('/template', function(req, res, next) {
    res.render('template', { title: 'Express' });
});

module.exports = router;
