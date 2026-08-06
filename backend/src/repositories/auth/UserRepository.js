const User = require("../../models/User");

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findById(userId) {
        return await User.findById(userId);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByGoogleId(googleId) {
        return await User.findOne({ googleId });
    }

    async update(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async updateRefreshToken(userId, refreshTokenHash) {
        return await User.findByIdAndUpdate(
            userId,
            { refreshTokenHash },
            { new: true }
        );
    }

    async updateLastLogin(userId) {
        return await User.findByIdAndUpdate(
            userId,
            { lastLoginAt: new Date() },
            { new: true }
        );
    }

    async delete(userId) {
        return await User.findByIdAndDelete(userId);
    }
}

module.exports = new UserRepository();