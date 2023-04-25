/* title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
id (código identificador)
stock (número de piezas disponibles) */
const fs = require('fs');
class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async init() {
    try {
      const file = fs.existsSync(this.path);
      if (!file) {
        fs.promises.writeFile(this.path, '[]');
        console.log('File created.');
      } else {
        this.products = JSON.parse(
          await fs.promises.readFile(this.path, 'utf-8')
        );
      }
    } catch (error) {
      console.log(`Error initializing productManager: ${error}`);
    }
  }

  async addProduct({ title, description, price, thumbnail, stock, code }) {
    try {
      stock = stock ?? 0;
      if (!title || !description || !price || !thumbnail || !code) {
        throw new Error('you must enter all the data to add the product.');
      }
      if (isNaN(Number(price)) || isNaN(Number(stock))) {
        throw new Error('Price and stock must be numbers.');
      }

      let id;
      if (this.products.length === 0) {
        id = 1;
      } else {
        let lastProduct = this.products[this.products.length - 1];
        id = lastProduct.id + 1;
      }

      let product = {
        title,
        description,
        price,
        thumbnail,
        stock,
        id,
        code,
      };
      this.products.push(product);
      const content = await JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, content);
      console.log('Product added successfully!');
    } catch (error) {
      console.log(`Error at creating new user: ${error}`);
    }
  }

  getProducts() {
    console.log(this.products);
    return this.products;
  }
  getProductById(id) {
    try {
      if (!id) {
        console.log('You need to provide an id.');
      } else {
        let productById = this.products.find((e) => e.id === id);
        if (productById) {
          console.log(productById);
          return productById;
        } else {
          throw new Error('Product not found');
        }
      }
    } catch (error) {
      console.error(`Error finding product: ${error}`);
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, stock, code }
  ) {
    try {
      if (!id) throw new Error('Need to provide an id.');
      const productIndex = this.products.findIndex(
        (product) => product.id === id
      );
      if (productIndex === -1) {
        throw new Error('Product not found.');
      }
      if (isNaN(Number(price)) || isNaN(Number(stock))) {
        throw new Error('Price and stock must be numbers.');
      }

      const productToUpdate = {
        ...this.products[productIndex],
        title,
        description,
        price,
        thumbnail,
        stock,
        code,
      };
      this.products[productIndex] = productToUpdate;

      const content = await JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, content);
    } catch (error) {
      console.error(`Error updating the product: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) throw new Error('Need to provide an id.');
      const index = this.products.findIndex((e) => e.id === id);
      this.products.splice(index, 1);
      const content = await JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, content);
      console.log('Product deleted successfully.');
    } catch (error) {
      console.error(error);
    }
  }
}

const manager = new ProductManager('./data.json');

const crud = async () => {
  await manager.init();
  await manager.getProducts();
  await manager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
  });
  await manager.getProducts();
  await manager.getProductById(1);
  await manager.updateProduct(1, {
    title: 'Nuevo titulo',
    description: 'Nueva descripción',
    price: 1,
    thumbnail: 'nueva imagen',
    stock: 10,
    code: 'ABC123',
  });
  await manager.deleteProduct(3);
};
crud();
