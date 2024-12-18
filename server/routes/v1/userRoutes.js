import { Router } from "express";
import {
  userSignup,
  userLogin,
  userLogout,
  userProfile,
  updateUserProfile,
  checkUser,
  deactivateUser,
} from "../../controllers/userControllers.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { upload } from "../../middlewares/multer.js";

// Configure router
export const userRouter = Router();

// Register new user
userRouter.post("/signup", upload.single("profilePicture"), userSignup);

// Login user
userRouter.post("/login", userLogin);

// Logout user
userRouter.post("/logout", userAuth, userLogout);

// Display user profile
userRouter.get("/profile", userAuth, userProfile);

// Update user profile details
userRouter.put("/update-profile", userAuth, updateUserProfile);

// Decactivate user profile
userRouter.put("/deactivate-profile", userAuth, deactivateUser);

// Check user when routing
userRouter.get("/check-user", userAuth, checkUser);
