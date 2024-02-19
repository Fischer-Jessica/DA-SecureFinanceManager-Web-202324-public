/**
 * Represents a user object.
 * @interface User
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface User {
  /**
   * The unique identifier of the user.
   * @type {number}
   * @memberof User
   */
  userId?: number;

  /**
   * The username of the user.
   * @type {string}
   * @memberof User
   * @required
   */
  username: string;

  /**
   * The password of the user.
   * @type {string}
   * @memberof User
   * @required
   */
  password: string;

  /**
   * The email address of the user.
   * @type {string}
   * @memberof User
   */
  emailAddress?: string;

  /**
   * The first name of the user.
   * @type {string}
   * @memberof User
   */
  firstName?: string;

  /**
   * The last name of the user.
   * @type {string}
   * @memberof User
   */
  lastName?: string;
}
