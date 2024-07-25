import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Account from "../models/account.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }

    if (firstname.trim().length < 2 || firstname.trim().length > 16) {
      return res.status(400).json({
        success: false,
        message: "Firstname must be between two and  fifteen characters",
      });
    }

    if (lastname.trim().length < 2 || lastname.trim().length > 16) {
      return res.status(400).json({
        success: false,
        message: "Lastname must be between five and  fifteen characters",
      });
    }

    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+(?:\s+[a-zA-ZÀ-ÖØ-öø-ÿ'-]+)*$/;

    if (!nameRegex.test(firstname)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid first name",
      });
    }

    if (!nameRegex.test(lastname)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid last name",
      });
    }

    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast eight character",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    await Account.create({
      userId: user._id,
      balance: 10000,
    });
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during register user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not  registered",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    const payload = {
      _id: user._id,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "7d",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };
    res.cookie("token", token, cookieOptions);
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during login user",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(201).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during logout user",
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const userId = req.user._id;
    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [
            { firstname: { $regex: filter, $options: "i" } },
            { lastname: { $regex: filter, $options: "i" } },
          ],
        },
      ],
    }).select("-password");

    return res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during filtering users",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User details fetch successfully",
      user,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during fetching user details ",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!firstname?.trim() && !lastname?.trim() && !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide some values",
      });
    }
    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    if (email) {
      user.email = email;
    }
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during updating  user",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (email && !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter an email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset/password/${resetToken}`;

    await sendEmail(email, resetLink);

    return res.status(201).json({
      success: true,
      message: `Password reset link sent to your ${email}`,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during forgot password ",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword?.trim() || !confirmPassword?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast eight characters",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password does not match",
      });
    }
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during reset password",
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  searchUser,
  userProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
