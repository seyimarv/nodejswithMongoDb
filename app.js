const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/Database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const OrderItem = require('./models/Order-item')
const Order = require('./models/orders')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM `node-complete`.products;').then(result => {
//     console.log(result[0])
// }).catch((err) => {
//     console.log(err)
// }); //execute a rquest and write sql syntax as a string

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
     User.findByPk(1).then(user => {
         req.user = user;
         next();
     }).catch(err => console.log(err))
}) // this middleware stores user in the requests s it can be use in different parts of the part. user retrieved from the database(a sequelize object with utitliy methods added by sequelize like user.destroy())

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});   // relating a User To a Product
User.hasMany(Product); // a user as many Products
User.hasOne(Cart); // a user has one Cart
Cart.belongsTo(User); // a Cart belongs to a user
Cart.belongsToMany(Product, {through: CartItem}) // A cart can belong to several Products
Product.belongsToMany(Cart,  {through: CartItem}) // A product can belong to many Carts
Order.belongsTo(User);
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem });

// sync({force: true}) // force sync to reset to default
sequelize.
sync().
then(result => {
  return  User.findByPk(1);
    // console.log(result)
   
}).then(user => {
    if (!user) {
     return   User.create({name: "marvy", email: 'test@gmail.com'})

    }
    return user;
}).then(user => {
    console.log(user)
   return user.createCart()
}).then(cart => {
    app.listen(3000)
}).catch(err => {
    console.log(err)
})  //takes a look defined models and creates a table for them 


