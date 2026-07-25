import express from "express";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { User } from "./models/User.js";
import { register, login } from "./controllers/user.js";
import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Register_database",
  })
  .then(() => {
    console.log("mongodb connected....");
  })
  .catch((err) => {
    console.log(err);
  });

// multer configuration
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", upload.single("file"), register);
app.post("/login", login);

app.get("/users", async (req, res) => {
  let users = await User.find().sort({ createdAt: -1 });
  res.render("users.ejs", { users });
});

// Routes
app.get("/", (req, res) => {
  res.render("login.ejs");
});
const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
