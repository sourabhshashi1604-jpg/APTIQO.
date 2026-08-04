const bcrypt = require("bcryptjs");
const { AUTH } = require("../constants");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, AUTH.PASSWORD_SALT_ROUNDS);
};

module.exports = hashPassword;
