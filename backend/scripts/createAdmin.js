const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Admin credentials
const ADMIN_CREDENTIALS = {
  name: 'Admin',
  email: 'admin@glowiva.com',
  password: 'Admin@123456',
  role: 'admin',
  phone: '+880 1234567890'
};

// User Schema (simplified for seed script)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  avatar: String,
  addresses: [Object],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('📧 Email:', ADMIN_CREDENTIALS.email);
      console.log('🔑 Use your existing password to login\n');
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User upgraded to admin role\n');
      }
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, salt);

      // Create admin user
      const admin = await User.create({
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        password: hashedPassword,
        role: 'admin',
        phone: ADMIN_CREDENTIALS.phone
      });

      console.log('\n✅ Admin user created successfully!\n');
      console.log('═══════════════════════════════════════');
      console.log('📋 ADMIN CREDENTIALS');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:    ', ADMIN_CREDENTIALS.email);
      console.log('🔑 Password: ', ADMIN_CREDENTIALS.password);
      console.log('👤 Role:     ', 'admin');
      console.log('═══════════════════════════════════════');
      console.log('\n🌐 Login at: http://localhost:3000/login');
      console.log('🎛️  Admin Dashboard: http://localhost:3000/admin\n');
    }

    // Disconnect
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
