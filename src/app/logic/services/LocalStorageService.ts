import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})

/**
 * Service for interacting with the browser's local storage.
 * @class LocalStorageService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class LocalStorageService {
  /**
   * Retrieves an item from the local storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} - The value associated with the key, or null if the key does not exist.
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to associate with the key.
   * @returns {void}
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Removes an item from the local storage.
   * @param {string} key - The key of the item to remove.
   * @returns {void}
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
