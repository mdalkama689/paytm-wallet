import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Transaction = new model("Transaction", transactionSchema);

export default Transaction;
