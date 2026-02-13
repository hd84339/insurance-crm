const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        // For now, return a default user. In production, this would use req.user from auth middleware
        let user = await User.findOne({ email: 'admin@insurance-crm.com' });

        if (!user) {
            // Create default user if doesn't exist
            user = await User.create({
                name: 'Admin User',
                email: 'admin@insurance-crm.com',
                phone: '+91 98765 43210',
                role: 'Administrator',
                location: 'Mumbai, India',
                bio: 'Senior Insurance Agent with 10+ years of experience in Life and Health insurance sectors.'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, location, bio } = req.body;

        // For now, update the default user. In production, use req.user._id
        let user = await User.findOne({ email: 'admin@insurance-crm.com' });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (location) user.location = location;
        if (bio) user.bio = bio;

        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        // For now, update the default user. In production, use req.user._id
        let user = await User.findOne({ email: 'admin@insurance-crm.com' });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete old avatar if exists
        if (user.avatar) {
            const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
            try {
                await fs.unlink(oldAvatarPath);
            } catch (err) {
                console.log('Old avatar file not found or already deleted');
            }
        }

        // Save new avatar path
        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile picture uploaded successfully'
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile picture',
            error: error.message
        });
    }
};

// @desc    Delete profile picture
// @route   DELETE /api/users/profile/avatar
// @access  Private
exports.deleteAvatar = async (req, res) => {
    try {
        // For now, update the default user. In production, use req.user._id
        let user = await User.findOne({ email: 'admin@insurance-crm.com' });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete avatar file if exists
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '../../', user.avatar);
            try {
                await fs.unlink(avatarPath);
            } catch (err) {
                console.log('Avatar file not found or already deleted');
            }
        }

        user.avatar = null;
        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        console.error('Delete avatar error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete profile picture',
            error: error.message
        });
    }
};
