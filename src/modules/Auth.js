/*

    THE FOLLOWING WAS ADAPTED FROM

    https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt

 */

class Auth {

    static Token = 'token';
    static Profile = 'profile';
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   * @param {Profile} profile
   */
  static authenticateUser(token, profile) {
    localStorage.setItem(this.Token, token);
    localStorage.setItem(this.Profile, profile);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem(this.Token) !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem(this.Token);
    localStorage.removeItem(this.Profile);
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem(this.Token);
  }

  static setProfile(profile) {
    localStorage.setItem(this.Profile, profile);
  }

  static getProfile(){
    return JSON.parse(localStorage.getItem(this.Profile));
  }

}

export default Auth;
