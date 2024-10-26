const express = require("express");
const router = express.Router();
const {
  getUserBudget,
  setUserBudget,
  addExpense,
  removeExpense,
  resetBudget
} = require("../controller/budgetController");

router.get("/:userId", getUserBudget);
router.post("/:userId", setUserBudget);
//add expanses
router.post("/:userId/expenses", addExpense);
//clear expanses
router.delete("/:userId/expenses",removeExpense);
//reste budget
router.delete("/:userId/reset",resetBudget);

module.exports = router;
