const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err)
  })

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render('shop/product-detail',{
      pageTitle: product.title,
      product: product,
      path: '/products'
    })
  }).catch(err => {
    console.log(err)
  }) // findByPk is a sequelize functionality that allows you to find individual elements by their id

  // Product.findAll({ where: { id: prodId } }).then(products => {
  //   res.render('shop/product-detail', {
  //     pageTitle: products[0].title,
  //     product: products[0],
  //     path: '/products'
  //   })
  // })    // you can all use the findall method to get individual product by using 'where'

}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err)
  })

};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    }).catch(err => {
      console.log(err)
    })
  // Cart.getCart(cart => {
  //   Product.fetchAll().then(([rows, fieldData]) => {
  //     const cartProducts = []
  //     for (product of rows) {
  //       const cartProductData = cart.products.find(prod => prod.id === product.id)
  //       if(cartProductData) {
  //           cartProducts.push({productData: product, qty:cartProductData.qty})
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   }).catch((err) => {
  //     console.log(err)
  //   })


  // })

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // let fetchedCart;
  // let newQuantity = 1;
  // // Product.findById(prodId, product => {
  // //   Cart.addProduct(prodId, product.price);
  // // });
  // req.user.getCart().then(cart => {
  //     fetchedCart = cart;
  //    return cart.getProducts({where: {id: prodId}});
  // }).then(products => {
  //   let product 
  //   if (products.length > 0) {
  //     product = products[0]
  //   }
  
  //   if(product) {
  //       const oldQuantity = product.CartItem.Quantity // GET FORMER QUANTITY IF ITEM ALREADY EXIST IN CART
  //       newQuantity = oldQuantity + 1
  //       return product;
  //   }
  //   return Product.findByPk(prodId) // magic method added by sequelize.

  // }).then(product => {
  //   return fetchedCart.addProduct(product, {
  //     through: {Quantity: newQuantity}
      
  //   }) // magic method added by sequelize.
  // }).then(result => {
  //   res.redirect('/cart')
  // }).catch(err => console.log(err))
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    console.log(result)
    res.redirect('/cart')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.deleteProductFromCart(prodId).then(result => {
    console.log(result)
    res.redirect('/cart')
  }).catch(err => {
    console.log(err)
  })
  // req.user.getCart().then(cart => {
  //   return cart.getProducts({where: {id: prodId}})
  // }).then(products => {
  //   const product = products[0];
  //   return product.CartItem.destroy()
  // }).then(result => {
  //   res.redirect('/cart')
  // }).catch(err => console.log(err))
  // // Cart.deleteProduct(prodId, productPrice);



}

exports.getOrders = (req, res, next) => {
  // check meaninin of include. here the relation between orders and Products allows you to instruct sequelize to fetch the products related to each Order
  req.user.getOrders().then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  }).catch(err => {
    console.log(err)
  })
 
};

exports.postOrder = (req, res, next) => {
  // req.user.getCart().then(cart => {
  //  return cart.getProducts()
  // }).then(products => {
  //    return req.user.createOrder().then(order => {
  //     return order.addProducts(products.map(product => {
  //        product.OrderItem = {  Quantity: product.CartItem.Quantity}
  //        return product;
  //      }))
  //    })
  //  })
  // .then(result => {
  //   res.redirect("/orders")
  // })
 req.user.addOrder().then(result => {
    res.redirect('/orders')
 }).catch(err => {
   console.log(err)
 })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
