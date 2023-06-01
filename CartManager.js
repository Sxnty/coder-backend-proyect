import fs from 'fs';
class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async init() {
    try {
      const file = fs.existsSync(this.path);
      if (!file) {
        fs.promises.writeFile(this.path, '[]');
        console.log('File created.');
      } else {
        console.log('readed');
        this.carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
      }
    } catch (error) {
      console.log(`Error initializing productManager: ${error}`);
      return error;
    }
  }

  async addCart() {
    try {
      let id;
      if (this.carts.length === 0) {
        id = 1;
      } else {
        let lastCart = this.carts[this.carts.length - 1];
        id = lastCart.id + 1;
      }
      let cart = {
        id,
        products: [],
      };

      this.carts.push(cart);
      const content = await JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, content);
      console.log('Cart added successfully!');
      return cart.id;
    } catch (error) {
      console.log(`addCart error: ${error}`);
      return error;
    }
  }

  async getCarts() {
    try {
      console.log(this.carts);
      return this.carts;
    } catch (error) {
      console.error(`getCarts error`);
      return error;
    }
  }

  getCartById(id) {
    try {
      if (!id) {
        throw new Error('Invalid id');
      }
      let cartById = this.carts.find((e) => e.id === id);
      if (cartById) {
        console.log(cartById);
        return cartById;
      } else {
        return { status: 400, message: 'product not found' };
      }
    } catch (error) {
      console.error(`Error finding cart: ${error}`);
      return { error: true, message: error.message };
    }
  }

  async addProductToCart(id, pid, quantity) {
    let cartById = this.carts.find((e) => e.id === id);
    let cartIndex = this.carts.findIndex((e) => e.id === id);

    if (cartIndex !== -1) {
      const existingProduct = this.carts[cartIndex].products.find(
        (product) => product.pid === pid
      );
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.carts[cartIndex].products.push({pid});
      }

      const content = await JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, content);
    }
  }
}

const cartManager = new CartManager('./carts.json');

/* const crud = async () => {
    await manager.init()
    await manager.addCart({ products: { pid: 2, quantity: 2 } });
    await manager.getCarts()
    await manager.getCartById(4)

};
crud(); */
export default cartManager;
