const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'hd84339@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'System Administrator',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isActive: true,
                status: 'Active'
            });
            console.log('✅ Default admin user created successfully');
        } else {
            // Ensure the admin has the correct role and is active
            adminExists.role = 'admin';
            adminExists.isActive = true;
            adminExists.status = 'Active';
            // Only update password if we want to reset it on every start? (Probably not, but let's keep it simple for now)
            await adminExists.save();
            console.log('ℹ️ Admin user already exists, ensured role and status are correct');
        }
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    }
};

module.exports = seedAdmin;
