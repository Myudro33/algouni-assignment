import Product from "../models/Product.js";
import filterService from "../services/filterService.js";

const getProducts = async (req, res) => {
  const query = filterService(Product.find(),req.query)
  try {
    const product = await query;
    res.json({ data: product });
  } catch (error) {
    res.json({ message: "server error", error: error.message });
  }
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
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description,stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description,stock },
      { new: true, runValidators: true }
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
   const product = await Product.deleteOne({id:parseInt(req.params.id)});
   if(!product){
    res.status(404).json({message:"product not found"})
   }
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
  res.json({ message: "Product archived successfully" });
};
const buyProduct = async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "product doesn't exists" });
    }
    if (product.stock < 1) {
      return res.status(400).json({ message: "Product is out of stock" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: -1 } },
      { new: true }
    );
    res.status(200).json({
      message: "You bought this product successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

const getCategoryStats = async(req,res)=>{
  const stats = await Product.aggregate([
    {
      $group:{
        _id:"$category",
        numProducts:{$sum:1},
        avgPrice:{$avg:"$price"},
        minPrice:{$min:"$price"},
        maxPrice:{$max:"$price"}
      }
    },
    {$sort:{avgPrice:1}}
  ])
 return res.json(stats)
}

const getPriceRangeStats= async (req,res)=>{
  try {
    const products = await Product.aggregate([
      {
        $match: { archived: false }
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [200, 800, 1200, 1800],
          output: {
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            products: { $push: "$$ROOT" }
          }
        }
      },
      {
        $addFields: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 200] }, then: "200-800" },
                { case: { $eq: ["$_id", 800] }, then: "800-1200" },
                { case: { $eq: ["$_id", 1200] }, then: "1200-1800" },
                { case: { $eq: ["$_id", 1800] }, then: "1200-inf" }
              ],
              default: "Other"
            }
          }
        }
      }
    ]);

    res.json({data:products,message:'product aggregations'})
  } catch (error) {
    res.status(500).json({message:'server error',error:error.message})
  }
}
export { getProducts, buyProduct, createProduct, deleteProduct, updateProduct,getCategoryStats,getPriceRangeStats };
