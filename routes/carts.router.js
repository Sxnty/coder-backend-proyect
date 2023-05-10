import { Router } from 'express';
import cartManager from '../CartManager.js';
const router = Router();

router.get('/:cid', async (req, res) => {
  if (req.params.cid) {
    let id = Number(req.params.cid);
    let carrito = await cartManager.getCartById(id);
    if (carrito.status === 400) {
      return res
        .status(400)
        .json({ status: 400, message: 'product not found!' });
    }
    return res.json({ status: 200, payload: carrito.products });
  } else {
    return res.json({ status: 400, message: 'check data!' });
  }
});
router.post('/', async (req, res) => {
  await cartManager.addCart();
  res.json({ status: 200, message: 'cart created!' });
});
router.post('/:cid/product/:pid', async(req, res) => {
    if(req.body && req.params) {
        let cid = Number(req.params.cid)
        let pid = Number(req.params.pid)
        let quantity = req.body.quantity
        await cartManager.addProductToCart(cid, pid, quantity)
        res.json({status:200, message:"added product"})
    }
})
export default router;
