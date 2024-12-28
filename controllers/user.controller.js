const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../services/authToken");
const Conversation = require("../models/conversation");
const { tokenMaxAge } = require("../constants/constants");

const handleUserRegister = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    if (!name || !email || !password || !number) {
      return res.status(400).send("All fields are required!");
    }

    const isEmailAlreadyExist = await User.findOne({ email });
    const isNumberAlreadyExist = await User.findOne({ number });

    if (isEmailAlreadyExist || isNumberAlreadyExist) {
      return res.status(400).send("User already exists!");
    }

    await User.create({ name, email, password, number });
    return res.status(201).send("User created successfully!");
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Error creating user!" });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("All fields are required!");
    }

    const user = await User.findOne({
      $or: [{ email: username }, { number: username }],
    });
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Invalid credentials!");
    }

    const token = generateToken(user);
    res.cookie("token", token);

    await User.findByIdAndUpdate(user._id, { token });

    return res.status(200).json({
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        number: user.number,
      },
      message: "Login Successful!",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Error logging in!" });
  }
};

const handleGetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersData = users.map((user) => ({
      user: {
        email: user.email,
        name: user.name,
        number: user.number,
        userId: user._id,
      },
    }));

    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users!" });
  }
};

const handleGetCurrentUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ message: "User data is required!" });
    }

    const currentUser = await User.findOne({ email: user.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json(currentUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Error fetching user!" });
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ message: "User data is required!" });
    }

    const currentUser = await User.findOne({ email: user.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userId = currentUser._id;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ message: "User and related data deleted!", conversations });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user!" });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const userEmail = req.params.user_email;
    const { userDetails } = req.body;

    if (!userEmail || !userDetails) {
      return res
        .status(400)
        .json({ message: "Email and user details are required!" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      userDetails,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      user: {
        userId: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        number: updatedUser.number,
      },
      token: updatedUser.token,
      message: "User updated successfully!",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Failed to update user!" });
  }
};

module.exports = {
  handleUserRegister,
  handleUserLogin,
  handleGetAllUsers,
  handleGetCurrentUser,
  handleDeleteUser,
  handleUpdateUser,
};
