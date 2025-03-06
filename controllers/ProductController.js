import fs from "fs";
import Product from "../models/Product.js";

const data = JSON.parse(fs.readFileSync("./data/data.json"));

const getProducts = async (req, res) => {
  const product = await Product.find({});
  res.json({ data: product });
};
const createProduct = async (req, res) => {
  const { name, price, stock, description } = req.body;
  const existingProduct = await Product.findOne({ name });
  if (!name || !price || !stock || !description) {
    return res
      .status(400)
      .json({ message: "name, price, stock and description are required!" });
  }
  if (existingProduct) {
    return res.status(400).json({ message: "Product name already exists" });
  }
    const newProduct = new Product({
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });
    await newProduct.save();
    return res.json({
      message: "new product is created",
      data: newProduct,
    });
};
const updateProduct = (req, res) => {
  const productIndex = data.findIndex(
    (item) => item.id === parseInt(req.params.id)
  );
  const newProduct = { ...data[productIndex], ...req.body };
  data[productIndex] = newProduct;
  fs.writeFileSync("./data/data.json", JSON.stringify(data));
  res.json({
    message: "Product updated",
    data: data[productIndex],
  });
};
const deleteProduct = (req, res) => {
  const newProducts = data.filter(
    (product) => product.id !== parseInt(req.params.id)
  );
  fs.writeFileSync("./data/data.json", JSON.stringify(newProducts));
  res.json({
    message: "Product is deleted successfully",
  });
};
const buyProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = data.findIndex((product) => product.id === productId);
  if (data[productIndex].stock < 1) {
    res.status(406).send({ message: "stock is 0" });
  }
  data[productIndex] = {
    ...data[productIndex],
    stock: data[productIndex].stock - 1,
  };
  fs.writeFileSync("./data/data.json", JSON.stringify(data));
  res.json({
    message: "you bought that product",
    data: data[productIndex],
  });
};

export { getProducts, buyProduct, createProduct, deleteProduct, updateProduct };
