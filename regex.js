module.exports = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,

    PHONE: /^[0-9]{10}$/,

    USERNAME: /^[a-zA-Z0-9_]{3,30}$/,

    URL: /^(https?:\/\/).+/,
};