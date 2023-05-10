import express from 'express';
import manager from './productManager.js';
import cartManager from './CartManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
let server = express();
let PORT = 8080;
server.use(express.json())

let ready = async () => {
  console.log('Server ready on port ', PORT);
  await cartManager.init();
  await manager.init();
};
server.listen(PORT, ready);

let cartsRoute = '/api/carts';
let cartsFunction = async (req, res) => {
  try {
    let carts = await cartManager.getCarts();
    return res.send({ succes: true, response: carts });
  } catch (error) {
    return res.send({ succes: false, error: error.message });
  }
};
let cartByIdRoute = '/api/carts/:cid';
let cartByIdFunction = async (req, res) => {
  try {
    let parameter = req.params;
    let cid = Number(parameter.cid);
    let cart = await cartManager.getCartById(cid);
    if (!cart.error) {
      return res.send({ success: true, response: cart });
    } else {
      return res.send({ success: false, error: cart.message });
    }
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};
server.use('/api/products', productsRouter)
/* server.get(queryRoute, queryFunction); */
/* server.get(productByIdRoute, productByIdFunction); */
server.use('/api/carts', cartsRouter)