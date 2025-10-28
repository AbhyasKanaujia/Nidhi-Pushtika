const User = require('../models/User');
const bcrypt = require('bcrypt');

// List all users (admin only)
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      isActive: true
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user info or reset password (admin only)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const allowedKeys = ['name', 'role', 'password', 'isActive'];
    const updateKeys = Object.keys(req.body);

    // Check for unsupported keys
    const unsupportedKeys = updateKeys.filter(key => !allowedKeys.includes(key));
    if (unsupportedKeys.length > 0) {
      return res.status(400).json({
        message: `Update failed. Unsupported keys: ${unsupportedKeys.join(', ')}. Allowed keys: ${allowedKeys.join(', ')}.`
      });
    }

    const { name, role, password, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    updateData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft-disable a user (admin only)
const disableUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const disabledUser = await User.findByIdAndUpdate(userId, { isActive: false, updatedAt: new Date() }, { new: true });
    if (!disabledUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  disableUser
};
