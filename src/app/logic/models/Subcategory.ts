/**
 * Represents a subcategory object.
 * @interface Subcategory
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface Subcategory {
  /**
   * The unique identifier of the subcategory.
   * @type {number}
   * @memberof Subcategory
   */
  subcategoryId?: number;

  /**
   * The unique identifier of the category to which the subcategory belongs.
   * @type {number}
   * @memberof Subcategory
   * @required
   */
  subcategoryCategoryId: number;

  /**
   * The name of the subcategory.
   * @type {string}
   * @memberof Subcategory
   * @required
   */
  subcategoryName: string;

  /**
   * The description of the subcategory.
   * @type {string}
   * @memberof Subcategory
   */
  subcategoryDescription?: string;

  /**
   * The unique identifier of the color associated with the subcategory.
   * @type {number}
   * @memberof Subcategory
   * @required
   */
  subcategoryColourId: number;

  /**
   * The unique identifier of the user who owns the subcategory.
   * @type {number}
   * @memberof Subcategory
   */
  userId?: number;
}
