import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  oldStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  changedAt: { type: Date, default: Date.now }
});

export default mongoose.model("StockHistory", stockHistorySchema);
