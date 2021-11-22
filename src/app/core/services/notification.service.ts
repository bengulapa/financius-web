import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';

export interface DialogData {
  title?: string;
  content: string;
  okButtonText?: string;
  okButtonColor?: 'primary' | 'accent' | 'warn';
  cancelButtonText?: string;
  hideCancelButton?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

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

  confirm(data: DialogData) {
    return this.dialog.open(CustomDialogComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        ...data,
        title: 'Confirm',
        okButtonColor: data.okButtonColor || 'primary',
        okButtonText: data.okButtonText || 'Yes',
        cancelButtonText: data.cancelButtonText || 'Cancel',
        hideCancelButton: data.hideCancelButton || false,
      },
    });
  }

  info(data: DialogData) {
    return this.dialog.open(CustomDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '400px',
      data: {
        ...data,
        okButtonColor: data.okButtonColor || 'primary',
        okButtonText: data.okButtonText || 'OK',
        hideCancelButton: true,
      },
    });
  }
}
