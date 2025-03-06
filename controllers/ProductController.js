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
const buyProduct = async (req, res) => {
    try{
        const product = Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"product doesn't exists"})
        }
        if(product.stock<1){
            return res.status(400).json({message:'Product is out of stock'})
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {$inc:{stock:-1}},
            {new:true}
        )
        res.status(200).json({ message: "You bought this product successfully", data: updatedProduct });
    }catch(err){
        res.status(500).json({message:'server error',error:err.message})
    }
};

export { getProducts, buyProduct, createProduct, deleteProduct, updateProduct };
