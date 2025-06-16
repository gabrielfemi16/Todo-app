const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

dotenv.config();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, //Enable credentails(cookies, auththorization headers, etc.)
  optionsSuccessStatus: 204, //Some legacy browsers(IE11, various smartTvs)choke on 204
};

app.use(cors(corsOptions));

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
  }
};
connectToDb();

app.use("/account", authRoutes);
app.use("/user", userRoutes);
app.use("/user", forgotPasswordRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening to request at port ${process.env.PORT}`);
});
