const mongodb = require('mongodb') // import mongoDB

const MongoClient = mongodb.MongoClient; // import mongo client

let _db;

const mongoConnect = (callback) => {
    // connect client to DATABASE, copy url from mongoDb after clicking connect and replace <password> with your password
    // connect returns a promise
     MongoClient.connect('mongodb+srv://Marvelous:Tomilayo1@cluster0.yopfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
     .then(client => {
        console.log('connected')
       _db = client.db();
       callback();
    }).catch(err => {
        console.log(err)
       
    })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
  
    throw 'No database found'
   
}

exports.mongoConnect  = mongoConnect;
exports.getDb = getDb;