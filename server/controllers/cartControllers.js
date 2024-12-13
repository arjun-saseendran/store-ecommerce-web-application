import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { catchErrorHandler } from "../utils/catchErrorHandler.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    // Get user id
    const { userId } = req.user;

    // Get productId
    const { productId } = req.body;

    // Check productId field
    if (!productId) {
      return res.status(400).json({ message: "Please provide product id" });
    }

    // Find the product
    const product = await Product.findById(productId);

    // Handle product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user's cart or create new one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    // Handle cart not found
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check the product already in the cart
    const productExists = cart.products.some((product) =>
      product.productId.equals(productId)
    );

    // Handle product found in the cart
    if (productExists) {
      // Increase product quanitity
      productExists.quantity++;

      // Recalculate total
      cart.calculateTotalPrice();
    }

    // Add product to cart
    cart.products.push({ productId, price: product.price });

    // Recalculate total
    cart.calculateTotalPrice();

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart", data: cart });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Render cart products
export const renderCart = async (req, res) => {
  try {
    // Get user id
    const { userId } = req.user;

    // Get cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    // Check cart exists
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Display cart
    res.status(200).json({ message: "Cart fetched successfully", data: cart });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};

// Remove product
export const removeProduct = async (req, res) => {
  try {
    // Get product id
    const { id } = req.param;

    // Remove product
    const removedProduct = await Cart.findByIdAndDelete(id);

    res.status(204).json({ message: "Product removed", data: removedProduct });
  } catch (error) {
    // Handle catch error
    catchErrorHandler(res, error);
  }
};
