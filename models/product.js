const getDb = require('../util/Database').getDb;
const mongoDb = require('mongodb')


class Product  {
  constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongoDb.ObjectId(id) : null;
        this.userId = userId; 
  }
  save() { 
    const db = getDb(); // a connection that returns the database instance
    let dbOp
     if (this._id)  {
       // update product / edit exixting product
       dbOp = db.collection('products').updateOne({_id :this._id}, {$set: this})

     } else {
       // add new product
       dbOp =  db.collection('products').insertOne(this)
     }
      
     return dbOp.then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
    }) // connect to any collection. if collection does not exist, it is created. insertOne is one of the methods present in mongoDb to create an object. check details at the official docs 
  }
  // interact with mongoDb database to fetch all products
  static fetchAll() {
      const db = getDb()
      return db.collection("products").find().toArray()
      .then(products => {
        console.log(products);
        return products
      }).catch(err => {
        console.log(err)
      }); // find is a method to find Data on M0ngoDb, which returns a cursor(allows you to go through your data step by step ) read more on find
  }
  // imteract with mongodb to fecth a single product
  static findById(prodId) {
    const db = getDb();
    // next() returns the last document that was returned by find()
    return db.collection('products').find({_id: new mongoDb.ObjectId(prodId)}).next().then(product => {
      console.log(product)
      return product
    }).catch(err => {
      console.log(err)
    })

  }
  static deleteById(prodId) {
    const db = getDb();
   return db.collection('products').deleteOne({_id: new mongoDb.ObjectId(prodId)}).then(result => {
     console.log("product deleted")
   }).catch(err => {
     console.log(err)
   })
    
  }
}



module.exports = Product;
