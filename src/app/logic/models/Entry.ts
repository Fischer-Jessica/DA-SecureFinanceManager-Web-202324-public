/**
 * Represents an entry object.
 * @interface Entry
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface Entry {
  /**
   * The unique identifier of the entry.
   * @type {number}
   * @memberof Entry
   */
  entryId?: number;

  /**
   * The name of the entry.
   * @type {string}
   * @memberof Entry
   */
  entryName?: string;

  /**
   * The description of the entry.
   * @type {string}
   * @memberof Entry
   */
  entryDescription?: string;

  /**
   * The amount associated with the entry.
   * @type {number}
   * @memberof Entry
   * @required
   */
  entryAmount: number;

  /**
   * The creation time of the entry.
   * @type {string}
   * @memberof Entry
   */
  entryCreationTime?: string;

  /**
   * The time of the transaction for the entry.
   * @type {string}
   * @memberof Entry
   * @required
   */
  entryTimeOfTransaction: string;

  /**
   * The attachment associated with the entry.
   * @type {string}
   * @memberof Entry
   */
  entryAttachment?: string;

  /**
   * The unique identifier of the subcategory associated with the entry.
   * @type {number}
   * @memberof Entry
   * @required
   */
  subcategoryId: number;

  /**
   * The unique identifier of the user who owns the entry.
   * @type {number}
   * @memberof Entry
   */
  userId?: number;
}
