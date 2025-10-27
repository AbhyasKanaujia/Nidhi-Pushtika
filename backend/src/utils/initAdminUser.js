const User = require('../models/User');
const bcrypt = require('bcrypt');

const createInitialAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin', isActive: true });
    if (!adminExists) {
      const email = process.env.INITIAL_ADMIN_EMAIL;
      const password = process.env.INITIAL_ADMIN_PASSWORD;
      if (!email || !password) {
        console.warn('Initial admin credentials not set in environment variables.');
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const adminUser = new User({
        name: 'Admin',
        email,
        passwordHash,
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log(`Initial admin user created.`);
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};

module.exports = createInitialAdminUser;
