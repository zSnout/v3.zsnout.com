const bcrypt = require("bcryptjs");

console.write("bcrypt", "loaded bcrypt...");
module.exports = {
  async hash(text) {
    return await bcrypt.hash(text, 10);
  },

  async check(text, hash) {
    return await bcrypt.compare(text, hash);
  },
};
