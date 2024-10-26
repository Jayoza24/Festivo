const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")
const emailRoutes = require("./routes/emailRoutes")
const budgetRoutes = require("./routes/budgetRoutes")
const vendorsRoutes = require("./routes/vendorsRoutes")
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/emails',emailRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/budget',budgetRoutes);
app.use('/vendors',vendorsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
