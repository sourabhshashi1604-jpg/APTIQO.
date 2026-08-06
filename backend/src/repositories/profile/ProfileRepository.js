const Profile = require("../../models/Profile");

class ProfileRepository {
    async create(profileData) {
        return await Profile.create(profileData);
    }

    async findByUserId(userId) {
        return await Profile.findOne({ user_id: userId });
    }

    async update(userId, updateData) {
        return await Profile.findOneAndUpdate(
            { user_id: userId },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(userId) {
        return await Profile.findOneAndDelete({
            user_id: userId,
        });
    }
}

module.exports = new ProfileRepository();