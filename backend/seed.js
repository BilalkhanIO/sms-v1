import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import 'dotenv/config';

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');

    // Clear existing users
    await User.deleteMany();

    // Create test users
    const users = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'TEACHER',
        status: 'ACTIVE',
      },
    ];

    await User.insertMany(users);

    console.log('Users seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
