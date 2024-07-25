import Account from "../models/account.model.js";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

const checkBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const account = await Account.findOne({
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Fetch balance successfully",
      account,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during fetching  balance",
    });
  }
};

const transfer = async (req, res) => {
  const userId = req.user._id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { amount } = req.body;
    const { to } = req.body;
    if (!amount || !amount.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter the amount",
      });
    }
    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Please give reciever id",
      });
    }
    const account = await Account.findOne({ userId }).session(session);

    if (!account) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        success: false,
        message: "Account not found",
      });
    }

    if (account.balance < amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid account",
      });
    }

    await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(
      session
    );
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    const transactionHistory = new Transaction({
      amount,
      from: userId,
      to,
      date: Date.now(),
    });
    await transactionHistory.save();

    await session.commitTransaction();
    await session.endSession();
    return res.status(201).json({
      success: true,
      message: "Transaction  successfully",
      transactionHistory,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during transaction",
    });
  }
};

const allTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const account = await Account.findOne({
      userId,
    });

    const allHistory = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    });

    await Transaction.populate(allHistory, {
      path: "from to",
      select: "firstname lastname email",
    });
    return res.status(201).json({
      success: true,
      message: "Fetch all transaction history successfully",
      allHistory,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during fetching  transaction history",
    });
  }
};
export { checkBalance, transfer, allTransactions };
