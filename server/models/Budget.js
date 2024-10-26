const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    userId: String,
    totalBudget: Number,
    expenses: [
        {
            category: String,
            vid: String,
            price: Number,
            date: { type: Date, default: Date.now }
        }
    ],
    remainingBudget: Number
});

module.exports = mongoose.model("Budget", budgetSchema);
