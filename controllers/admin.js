const { request } = require('express');
const Product = require('../models/product');



exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title, 
    price: price,
    imageUrl: imageUrl,
    description: description, 
  }).then(result => {
    res.redirect('/products')
  }); // a method present on the user sequelize object to the association defined in the app.js
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(() =>{
  //   res.redirect('/');
  // }).catch((err) => {
  //   console.log(err)
  // });
  
  //  Product.create({
  //    title: title, 
  //    price: price,
  //    imageUrl: imageUrl,
  //    description: description, 
  //    userId: req.user.id // extra information about user associated with the product
  //  }).then(result => {
  //    res.redirect('/admin/products')
  //    console.log(result)
  //  }).catch(err => {
  //    console.log(err)
  //  })  // creates a new element based on the model and saves it to the database - sequelize
};

exports.getEditProduct = (req, res, next) => {
  const editMode =  req.query.edit;
  if(!editMode) {
   return res.redirect('/')
  }
  const prodId = req.params.productId 
  req.user.getProducts({where: {id: prodId}}).then(products => {
    const product = products[0]
    if (!product) {
      return res.redirect('/');
    }
     res.render('admin/edit-product', {
       pageTitle: 'Edit Product',
       path: '/admin/edit-product',
       editing: editMode,
       product: product
     });
  }).catch(err => {
    console.log(err)
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findByPk(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
   return product.save(); // ensures that the updated product to the database. if products doeant  exist, it creates a new one
  }).then(result => {
    console.log('UPDATED PRODUCT')
    res.redirect('/admin/products')
  }).catch(err => console.log(err))
 

}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  // Product.deleteById(prodId)
  // Product.destroy({})  // alllows you to destroy any product tthat matches the parameters/description
  Product.findByPk(prodId).then(product => {
    return product.destroy()
    
  }).then(result => {
    console.log("PRODUCT DESTROYED")
    res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
 
}

exports.getProducts = (req, res, next) => {
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
  req.user.getProducts().then(products => {
    res.render('admin/products', {
           prods: products,
           pageTitle: 'Admin Products',
         path: '/admin/products'
     });
  }).catch(err => {
    console.log(err)
  })
};
