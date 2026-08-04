module.exports = {
    ADMIN: "admin",
    RECRUITER: "recruiter",
    CANDIDATE: "candidate",
};
const ROLES = require("../constants/roles");

if (user.role === ROLES.ADMIN) {
   ...
}