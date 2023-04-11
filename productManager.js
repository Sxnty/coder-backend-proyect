/* title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
id (código identificador)
stock (número de piezas disponibles) */

class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct({ title, description, price, thumbnail, stock }) {
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
    };
    this.products.push(product);
  }

  getProducts() {
    console.log(this.products);
    return this.products;
  }
  getProductById(id) {
    if (!id) {
      console.log("You need to provide an id.");
    } else {
      let productById = this.products.find((e) => e.id === id);
      if (productById) {
        console.log(productById);
        return productById;
      } else {
        console.log("Product not found");
      }
    }
  }
}

let products = new ProductManager();
products.addProduct({
  title: "Microphone",
  description:
    "It's the ideal all-in-one standalone microphone for either the aspiring streamer or podcaster looking for a condenser microphone with high-quality sound.",
  price: 200,
  thumbnail:
    "https://cdn.discordapp.com/attachments/990652909534449714/1095373629337911327/productos34_25773.png",
  stock: 2,
});

products.addProduct({
  title: "Mouse",
  description:
    "Ambidextrous mouse with grip surface that provides comfort and control for greater precision in games.",
  price: 2030,
  thumbnail:
    "https://cdn.discordapp.com/attachments/990652909534449714/1095373769633181787/61UxfXTUyvL.png",
  stock: 4,
});

products.addProduct({
  title: "Screen",
  description: "21.5-inch FHD borderless monitor.",
  price: 2030,
  thumbnail:
    "https://cdn.discordapp.com/attachments/990652909534449714/1095374578282405968/5017_1_9e03da5653d34c4b8fff32a618722f3b.png",
  stock: 4,
});

//products.getProducts();
products.getProductById(3);
