import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  baseCurrency: { type: String, required: true, default: "USD" }, // Default to USD
});

export default mongoose.model("Currency", currencySchema);
