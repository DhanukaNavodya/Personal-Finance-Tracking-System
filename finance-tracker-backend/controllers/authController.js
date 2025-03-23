import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
  const { username, contactNumber, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ 
      username, 
      contactNumber, 
      email, 
      password,
      role: role || 'USER'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: `Signup failed: ${err.message}` });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful',
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role ,contactNumber: user.contactNumber}
    });

  } catch (err) {
    res.status(500).json({ message: `Login failed: ${err.message}` });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "ADMIN" } }) // Exclude users with role "ADMIN"
      .select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch users: ${err.message}` });
  }
};

export const getUserEnrollmentStats = async (req, res) => {
  try {
    const enrollmentData = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by year-month
          count: { $sum: 1 }, // Count users per month
        },
      },
      { $sort: { _id: 1 } }, // Sort by date (ascending)
    ]);

    res.status(200).json(enrollmentData);
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch enrollment stats: ${err.message}` });
  }
};

export const getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};
