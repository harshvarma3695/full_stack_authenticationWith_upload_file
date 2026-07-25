import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User.js";

export const register =async (req, res) => {
  const file = req.file.path;
  const { name, email, password } = req.body;

  try {
    const cloudinaryRes = await cloudinary.uploader.upload(file, {
      folder: "register_database",
    });

    let user = await User.create({
      profileImg: cloudinaryRes.secure_url,
      name,
      email,
      password,
    });

    res.redirect("/");

    console.log(cloudinaryRes, name, email, password);
  } catch (error) {
    res.send("Error occured");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    console.log("getting user ", user);
    if (!user) res.render("login.ejs", { msg: "User not found" });
    else if (user.password != password) {
      res.render("login.ejs", { msg: "Invalid password" });
    } else {
      res.render("profile.ejs", { user });
    }
  } catch (error) {
    res.send("Error occured");
  }
};