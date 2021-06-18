const getDb = require('../util/Database').getDb;
const mongoDb = require('mongodb')

// user demo model
class User  {
  constructor(username, email, cart, id) {
      this.name = username;
      this.email = email;
      this.cart = cart; // {items: []}
      this._id = id;
  }
  save() {
    const db = getDb()
    return db.collection("users").insertOne(this)
  }

  addToCart(product) { 
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString(); // returns true if product exist
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
       // if cart product exist 
        newQuantity = this.cart.items[cartProductIndex].quantity + 1 // increment quantity if item already exist
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else { 
      // add a new item
      updatedCartItems.push({ productId: new mongoDb.ObjectId(product._id), quantity : newQuantity}) // get product id, and add new field "quantity"
    }
    
    const updatedCart = {items: updatedCartItems} 
    const db = getDb();
    db.collection("users").updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart : updatedCart}}) //only  update the Cart you have in a User object, only update user to add product to a cart
     
  }
  getCart() {
    const db = getDb() 
    const productIds = this.cart.items.map(i => {
      return i.productId
    }) // gets the id of each products in the items
   return db.collection('products').find({_id: {$in: productIds}}).toArray().then(products => {
      return products.map(product => {
        return {...product, quantity: this.cart.items.find(i => {
          return i.productId.toString() === product._id.toString(); 
        }).quantity //extract the qunatity for each product
      }
      })
    }); //extract the cart products from the products array in the db using their ids
  }
  deleteProductFromCart(prodId) {
      const db = getDb()
      const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString()
      })
      const updatedCart = {items: updatedCartItems}
    return  db.collection("users").updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart : updatedCart}})

  }
  addOrder() {
    const db = getDb();
   return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongoDb.ObjectId(this._id),
           Name: this.name,
        }   
      }
     return db.collection("orders").insertOne(order)
    }).then(result => {
      this.cart = {items: []}
      return  db.collection("users").updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart :{ items: []}}}) //empty 

    })
  }
  getOrders() {
    const db = getDb()
    return db.collection('orders').find({'user._id': new mongoDb.ObjectId(this._id)}).toArray(); // return orders for a specific user
  }
  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({_id: new mongoDb.ObjectId(userId)}).then(user => {
      console.log(user)
      return user
    }).catch(err => {
      console.log(err)
    })

  }
}

module.exports = User;