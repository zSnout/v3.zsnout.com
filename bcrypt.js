const bcrypt = require("bcryptjs");

module.exports = {
  async hash(text) {
    return await bcrypt.hash(text, 10);
  },

  async check(text, hash) {
    return await bcrypt.compare(text, hash);
  },
};