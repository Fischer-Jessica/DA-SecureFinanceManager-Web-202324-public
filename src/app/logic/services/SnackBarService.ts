import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})

/**
 * Service for displaying snackbar alerts.
 * @class SnackBarService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class SnackBarService {
  /**
   * Creates an instance of SnackBarService.
   * @param {MatSnackBar} snackBar - The MatSnackBar service for displaying snack bar alerts.
   * @param {TranslateService} translateService - The translation service for translating alert messages.
   */
  constructor(private snackBar: MatSnackBar,
              private translateService: TranslateService) {
  }

  /**
   * Shows a snackbar alert with the given message.
   * @param {string} message - The message to display in the alert.
   * @param type - The type of the alert.
   * @returns {void}
   */
  showAlert(message: string, type: 'error' | 'info' | 'missing' | 'invalid' | 'success'): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000000;
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    if (type == 'error') {
      config.panelClass = ['error-snackbar'];
    } else if (type == 'info') {
      config.panelClass = ['info-snackbar'];
    } else if (type == 'missing') {
      config.panelClass = ['missing-snackbar'];
    } else if (type == 'invalid') {
      config.panelClass = ['invalid-snackbar'];
    } else if (type == 'success') {
      config.panelClass = ['success-snackbar'];
    }

    this.snackBar.open(message, this.translateService.instant('alert_close'), config);
  }
}
