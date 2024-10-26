const Budget = require("../models/Budget");

// Get user budget
const getUserBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or update user budget
const setUserBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.params.userId });
    if (budget) {
      budget.totalBudget = req.body.totalBudget || budget.totalBudget;
      budget.remainingBudget =
        req.body.remainingBudget || budget.remainingBudget;
      budget.expenses = req.body.expenses || budget.expenses;
    } else {
      budget = new Budget({
        userId: req.params.userId,
        totalBudget: req.body.budget,
        remainingBudget: req.body.budget,
        expenses: [],
      });
    }
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add an expense
const addExpense = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    if (budget) {
      budget.expenses.push(req.body);
      budget.remainingBudget -= req.body.price;
      await budget.save();
      res.json(budget);
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove an expense
const removeExpense = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    if (budget) {
      budget.expenses = [];
      budget.remainingBudget = budget.totalBudget;
      await budget.save();
      res.json(budget);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Reset Budget
const resetBudget = async (req, res) => {
  try {
    const budget = await Budget.deleteOne({ userId: req.params.userId });
    if (budget) {
      res.status(200).json({ message: "Budget Reset Successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserBudget,
  setUserBudget,
  addExpense,
  removeExpense,
  resetBudget,
};
