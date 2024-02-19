/**
 * Represents a color object.
 * @interface Colour
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export interface Colour {
  /**
   * The unique identifier of the color.
   * @type {number}
   * @memberof Colour
   */
  colourId: number;

  /**
   * The name of the color.
   * @type {string}
   * @memberof Colour
   * @required
   */
  colourName: string;

  /**
   * The hexadecimal code of the color.
   * @type {string}
   * @memberof Colour
   * @required
   */
  colourCode: string;
}
