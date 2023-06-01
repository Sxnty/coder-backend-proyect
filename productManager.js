/* title (nombre del producto)
description (descripciÃ³n del producto)
price (precio)
thumbnail (ruta de imagen)
id (cÃ³digo identificador)
stock (nÃºmero de piezas disponibles) */
import fs from 'fs';
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
      return error;
    }
  }

  async addProduct({ title, description, price, thumbnail, stock, code, status, category }) {
    try {
      status = status ?? true;
      console.log(!title, !description , !price , !category , !code , !status)
      if (!title || !description || !price || !category || !code || !status) {
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
      return product.id;
    } catch (error) {
      console.log(`addProduct error: ${error}`);
      return error;
    }
  }

  getProducts() {
    try {
      console.log(this.products);
      return this.products;
    } catch (error) {
      console.error(`getProducts error`);
      return error;
    }
  }
  getProductById(id) {
    try {
      if (!id) {
        throw new Error('Invalid id');
      }
      let productById = this.products.find((e) => e.id === id);
      if (productById) {
        console.log(productById);
        return productById;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error(`Error finding product: ${error}`);
      return { error: true, message: error.message };
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, stock, code, category, status }
  ) {
    try {
      if (title && description && price && thumbnail && stock && code) {

        if (!id) throw new Error('Need to provide an id.');
        const productIndex = this.products.findIndex((product) => {
          return product.id == Number(id);
        });
        if (productIndex === -1) {
          return {status: 400, message:'product not found'}
        }
        /*       if (isNaN(Number(price)) || isNaN(Number(stock))) {
          throw new Error('Price and stock must be numbers.');
        } */

        const productToUpdate = {
          ...this.products[productIndex],
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
          category,
          status
        };
        this.products[productIndex] = productToUpdate;
        const content = await JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, content);
        return {status: 200, message:'updated'}
      } else {
        throw new Error('check data!')
      }
    } catch (error) {
      console.error(`Error updating the product: ${error}`);
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) throw new Error('Need to provide an id.');
      
      const index = this.products.findIndex((e) => e.id === id);
      
      if (index === -1) {
        return {status: 400, message:'product not found'}
      }
      
      this.products.splice(index, 1);
      const content = await JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, content);
      console.log('Product deleted successfully.');
      return {status: 200, message:'deleted'}
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  
}

const manager = new ProductManager('./data.json');

/* const crud = async () => {
  await manager.init();
  await manager.getProducts();

  await manager.addProduct({
    title: 'Libro de cocina',
    description: 'Libro de cocina con recetas de comida internacional',
    price: 39.99,
    thumbnail: 'https://example.com/images/libro.jpg',
    code: 'LC7842',
  });

  await manager.getProducts();
  await manager.getProductById(1);
  await manager.updateProduct(1, {
    title: 'Nuevo titulo',
    description: 'Nueva descripciÃ³n',
    price: 1,
    thumbnail: 'nueva imagen',
    stock: 10,
    code: 'ABC123',
  });
  await manager.deleteProduct(3);
};
crud(); */
export default manager;
