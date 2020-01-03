class TwitterHelper {
  static formatUsername = username => {
    if (username[0] !== '@') {
      return `@${username}`;
    }
    return username;
  };
}

module.exports = TwitterHelper;
