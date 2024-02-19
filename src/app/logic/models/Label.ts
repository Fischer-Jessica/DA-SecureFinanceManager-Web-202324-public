/**
 * Represents a label object.
 * @interface Label
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface Label {
  /**
   * The unique identifier of the label.
   * @type {number}
   * @memberof Label
   */
  labelId?: number;

  /**
   * The name of the label.
   * @type {string}
   * @memberof Label
   * @required
   */
  labelName: string;

  /**
   * The description of the label.
   * @type {string}
   * @memberof Label
   */
  labelDescription?: string;

  /**
   * The unique identifier of the color associated with the label.
   * @type {number}
   * @memberof Label
   * @required
   */
  labelColourId: number;

  /**
   * The unique identifier of the user who owns the label.
   * @type {number}
   * @memberof Label
   */
  userId?: number;
}
