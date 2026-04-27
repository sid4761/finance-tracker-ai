const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction
};