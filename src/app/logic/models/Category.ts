/**
 * Represents a category object.
 * @interface Category
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface Category {
  /**
   * The unique identifier of the category.
   * @type {number}
   * @memberof Category
   */
  categoryId?: number;

  /**
   * The name of the category.
   * @type {string}
   * @memberof Category
   * @required
   */
  categoryName: string;

  /**
   * The description of the category.
   * @type {string}
   * @memberof Category
   */
  categoryDescription?: string;

  /**
   * The unique identifier of the color associated with the category.
   * @type {number}
   * @memberof Category
   * @required
   */
  categoryColourId: number;

  /**
   * The unique identifier of the user who owns the category.
   * @type {number}
   * @memberof Category
   */
  categoryUserId?: number;
}
