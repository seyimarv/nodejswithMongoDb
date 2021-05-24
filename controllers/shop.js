const Product = require('../models/product');
const Cart = require('../models/cart')
const CartItem = require('../models/cart-item')
const Order = require('../models/orders')
const OrderItem = require('../models/Order-item')

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err)
  })
  // Product.fetchAll().then(([rows, fieldData]) => {
  //   res.render('shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // }).catch()

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findByPk(prodId).then((product) => {
  //   res.render('shop/product-detail',{
  //     pageTitle: product.title,
  //     product: product,
  //     path: '/products'
  //   })
  // }).catch(err => {
  //   console.log(err)
  // }) // findByPk is a sequelize functionality that allows you to find individual elements by their id

  Product.findAll({ where: { id: prodId } }).then(products => {
    res.render('shop/product-detail', {
      pageTitle: products[0].title,
      product: products[0],
      path: '/products'
    })
  })    // you can all use the findall method to get individual product by using 'where'

}

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
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
  req.user.getCart().then(cart => {
    return cart.getProducts().then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });

    }).catch(err => {
      console.log(err)
    })
  }).catch()
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
  let fetchedCart;
  let newQuantity = 1;
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  req.user.getCart().then(cart => {
      fetchedCart = cart;
     return cart.getProducts({where: {id: prodId}});
  }).then(products => {
    let product 
    if (products.length > 0) {
      product = products[0]
    }
  
    if(product) {
        const oldQuantity = product.CartItem.Quantity // GET FORMER QUANTITY IF ITEM ALREADY EXIST IN CART
        newQuantity = oldQuantity + 1
        return product;
    }
    return Product.findByPk(prodId) // magic method added by sequelize.

  }).then(product => {
    return fetchedCart.addProduct(product, {
      through: {Quantity: newQuantity}
      
    }) // magic method added by sequelize.
  }).then(result => {
    res.redirect('/cart')
  }).catch(err => console.log(err))
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  const productPrice = req.body.productPrice
  req.user.getCart().then(cart => {
    return cart.getProducts({where: {id: prodId}})
  }).then(products => {
    const product = products[0];
    return product.CartItem.destroy()
  }).then(result => {
    res.redirect('/cart')
  }).catch(err => console.log(err))
  // Cart.deleteProduct(prodId, productPrice);



}

exports.getOrders = (req, res, next) => {
  // check meaninin of include. here the relation between orders and Products allows you to instruct sequelize to fetch the products related to each Order
  req.user.getOrders({include: ['products']}).then(orders => {
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
  let fetchedCart; // first fecthedcart is empty
  req.user.getCart().then(cart => {
    fetchedCart= cart // then fetchedCart is set equal to Cart
    return cart.getProducts()
  }).then(products => {
    return req.user.createOrder().then(order => {
      order.addProducts(products.map(product =>  {
        product.OrderItem = { Quantity: product.CartItem.Quantity}
        return product;
      }))
    })
  }).then(result => {
    return fetchedCart.setProducts(null)//cart should drop all the items when ordered, so all products in cart is set to null.
}).then(result => {
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
