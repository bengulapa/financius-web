import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.toast(message, 'success');
  }

  error(message: string) {
    this.toast(message, 'error');
  }

  toast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, '', {
      panelClass: `toast-${type}`,
    });
  }
}
