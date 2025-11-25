// Seed data for testing
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 89.99,
    comparePrice: 129.99,
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    featured: true,
    tags: ['wireless', 'audio', 'bluetooth'],
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', public_id: 'sample1' }
    ]
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-packed smartwatch with fitness tracking, heart rate monitor, and GPS.',
    price: 249.99,
    comparePrice: 349.99,
    category: 'Electronics',
    stock: 35,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    tags: ['smartwatch', 'fitness', 'wearable'],
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', public_id: 'sample2' }
    ]
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and breathable mesh upper.',
    price: 79.99,
    category: 'Sports',
    stock: 100,
    rating: 4.3,
    numReviews: 245,
    featured: true,
    tags: ['shoes', 'running', 'sports'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', public_id: 'sample3' }
    ]
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning, perfect for all types of workouts.',
    price: 29.99,
    comparePrice: 49.99,
    category: 'Sports',
    stock: 75,
    rating: 4.6,
    numReviews: 156,
    featured: false,
    tags: ['yoga', 'fitness', 'exercise'],
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', public_id: 'sample4' }
    ]
  },
  {
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt in various colors. Perfect for everyday wear.',
    price: 19.99,
    category: 'Clothing',
    stock: 200,
    rating: 4.2,
    numReviews: 312,
    featured: false,
    tags: ['clothing', 'casual', 'cotton'],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', public_id: 'sample5' }
    ]
  },
  {
    name: 'Laptop Backpack',
    description: 'Durable backpack with padded laptop compartment and multiple pockets.',
    price: 59.99,
    comparePrice: 89.99,
    category: 'Other',
    stock: 60,
    rating: 4.4,
    numReviews: 98,
    featured: true,
    tags: ['backpack', 'laptop', 'travel'],
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', public_id: 'sample6' }
    ]
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    price: 129.99,
    category: 'Home & Garden',
    stock: 40,
    rating: 4.8,
    numReviews: 67,
    featured: true,
    tags: ['coffee', 'kitchen', 'appliance'],
    images: [
      { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', public_id: 'sample7' }
    ]
  },
  {
    name: 'JavaScript: The Complete Guide',
    description: 'Comprehensive guide to modern JavaScript programming. Perfect for beginners and experts.',
    price: 39.99,
    category: 'Books',
    stock: 120,
    rating: 4.9,
    numReviews: 423,
    featured: false,
    tags: ['book', 'programming', 'javascript'],
    images: [
      { url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500', public_id: 'sample8' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    console.log('Products deleted');

    // Create admin user if not exists
    let admin = await User.findOne({ email: 'admin@croxora.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@croxora.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Create products
    const createdProducts = await Product.insertMany(
      products.map(product => ({
        ...product,
        createdBy: admin._id
      }))
    );

    console.log(`${createdProducts.length} products created`);
    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@croxora.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
