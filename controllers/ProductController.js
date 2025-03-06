import fs from "fs";
import Product from "../models/Product.js";
import mongoose from "mongoose";

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
const updateProduct = async(req, res) => {
    try{
        const { id } = req.params;
        const { name, price, description } = req.body;
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
           id,
            { name, price, description },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
 
};
const deleteProduct =async(req, res) => {
    try{
        await Product.findOneAndDelete(req.params.id)
        res.json({message:'Product deleted successfully'})
    }
    catch(err){
        res.status(500).json({message:'server error',error:err.message})
    }
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
