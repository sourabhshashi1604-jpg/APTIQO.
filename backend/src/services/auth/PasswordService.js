const bcrypt = require("bcryptjs");

class PasswordService {
    /**
     * Hash plain password
     */
    async hashPassword(password) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Compare plain password with hashed password
     */
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = new PasswordService();