import User from "../model/user.schema.js";
import bcrypt from "bcrypt";

const cookieOption = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,

};

export const signUp = async (req, res) => {
  const { name, email, age, password } = req.body;

  if (!name || !email || !age || !password) {
    return res.status(400).send({ message: "Please enter all the fields" });
  }

    try {
      const existingUser = await User.findOne({ email }).select('+password');
          if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      age,
      password: hashPassword
    });

    const token = user.getJwtToken();
    res.cookie("token", token, cookieOption);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.getJwtToken();
    res.cookie("token", token, cookieOption);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.json({ message: "Login error", error: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
