import { Seller } from "../models/sellerModel.js";
import { passwordHandler } from "../utils/passowordHandler.js";
import { generateToken } from "../utils/tokenHandler.js";
import { catchErrorHandler } from "../utils/catchErrorHandler.js";

// Seller signup
export const sellerSignup = async (req, res) => {
  try {
    // Destructing data from request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    // Checking seller exists or not
    const sellerExist = await Seller.findOne({ email });
    if (sellerExist) {
      return res
        .status(400)
        .json({ message: "Seller already exist" })
        .select("-password");
    }
    // Hashing password
    const hashedPassword = await passwordHandler(password, undefined, res);

    // Creating new seller object
    const newSeller = new Seller({ name, email, password: hashedPassword });

    // Save new seller to database
    await newSeller.save();

    // Exclude password
    const { password: _, ...sellerWithoutPassword } = newSeller.toObject();

    res.json({
      message: "Seller created successfully",
      data: sellerWithoutPassword,
    });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Seller login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Checking seller
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({ message: "Seller not exist" });
    }

    // Checking password
    const matchedPassword = await passwordHandler(password, seller.password,res);

    if (!matchedPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Checking seller profile
    if (!seller.isActive) {
      return res.status(400).json({ message: "Seller profile deactivated" });
    }

    // Generating token
    const token = generateToken(seller, "seller", res);

    // Set token to cookie
    res.cookie("token", token);

    // Exclude password
    const { password: _, ...sellerWithoutPassword } = seller.toObject();

    res
      .status(200)
      .json({ message: "Login successfull", data: sellerWithoutPassword });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Seller profile details
export const sellerProfile = async (req, res) => {
  try {
    // Get seller id
    const { id } = req.seller;
    const sellerProfileData = await Seller.findById(id).select("-password");

    res.status(200).json({
      message: "seller profile details fetched",
      data: sellerProfileData,
    });
  } catch (error) {
    res;
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Seller logout
export const sellerLogout = async (req, res) => {
  // Clearing token from cookies
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Seller logout success" });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Update seller profile details
export const updatesellerProfile = async (req, res) => {
  try {
    // Get seller id
    const { id } = req.seller;

    // Update seller data
    const updatedSellerData = await Seller.findByIdAndUpdate(
      id,
      req.body
    ).select("-password");

    res.status(200).json({
      message: "seller profile details updated",
      data: updatedSellerData,
    });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Checking seller
export const checkseller = async (req, res) => {
  try {
    res.status(200).json({ message: "Autherized seller" });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

export const deactivateseller = async (req, res) => {
  try {
    // ger seller id
    const { id } = req.seller;
    await Seller.findByIdAndUpdate(id, { isActive: false });
    res.status(202).json({ message: "seller deactivated" });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};
