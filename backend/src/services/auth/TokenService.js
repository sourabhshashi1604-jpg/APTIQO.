const jwt = require("jsonwebtoken");

class TokenService {
    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
    }

    verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

module.exports = new TokenService();