import { Router } from 'express';
import manager from '../productManager.js';
const router = Router();

router.get('/', async (req, res) => {
  let limit = req.query.limit;
  if (req.query.limit) {
    let products = await manager.getProducts().slice(0, limit);
    console.log(products);
    if (!products.error) {
      return res.send({ success: true, products });
    } else {
      return res.send({ success: false, msg: 'Cant react products' });
    }
  } else {
    let products = await manager.getProducts();
    if (products.length > 0) {
      return res.send({ success: true, products });
    } else {
      return res.send({ success: false, msg: 'Cant reach products' });
    }
  }
});
router.get('/:pid', async (req, res) => {
  let parameter = req.params;
  let id = Number(parameter.pid);

  let one = await manager.getProductById(id);
  if (!one.error) {
    return res.send({
      success: true,
      response: one,
    });
  } else {
    return res.send({
      success: false,
      response: one.message,
    });
  }
});
router.post('/', async (req, res) => {
  let title = req.body.title ?? null;
  let description = req.body.description ?? null;
  let price = req.body.price ?? null;
  let thumbnail = req.body.thumbnail ?? null;
  let stock = req.body.stock ?? null;
  let code = req.body.code ?? null;
  let category = req.body.category ?? null;
  let status = req.body.status ?? null;
  if (title && description && price && category && stock && code) {
    let product = await manager.addProduct({
      title,
      description,
      price,
      thumbnail,
      stock,
      code,
      category,
      status
    });
    return res.json({
      userId: product.id,
      status: 201,
      message: 'product created!',
    });
  } else {
    return res.json({
      status: 400,
      message: 'check data!',
    });
  }
});
router.put('/:pid', async (req, res) => {
  try {
    if (req.body && req.params.pid) {
      let data = req.body;
      if (
        data.title &&
        data.description &&
        data.price &&
        data.thumbnail &&
        data.stock &&
        data.code
      ) {
        let id = Number(req.params.pid);
        let product = await manager.updateProduct(id, data);
        if (product.status === 400) {
          return res
            .status(400)
            .json({ status: 400, message: 'product not found!' });
        }
        return res.json({ status: 200, message: 'updated' });
      } else {
        return res.json({ status: 400, message: 'check data!' });
      }
    } else {
      return res.json({ status: 400, message: 'check data!' });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: 'internal server error',
    });
  }
});
router.delete('/:pid', async (req, res) => {
  try {
    if (req.params.pid) {
      let id = Number(req.params.pid);
      let product = await manager.deleteProduct(id);
      if (product.status === 400) {
        return res
          .status(400)
          .json({ status: 400, message: 'product not found!' });
      }
      return res.json({ status: 200, message: 'deleted' });
    } else {
      return res.status(400).json({ status: 400, message: 'check data!' });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: 'internal server error',
    });
  }
});
export default router;
