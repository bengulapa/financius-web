import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Account } from 'src/app/shared/models/entities.models';
import { AccountsFacade } from '../../state/accounts.facade';
import { AccountFormDialogComponent } from '../account-form-dialog/account-form-dialog.component';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent implements OnInit {
  constructor(
    public facade: AccountsFacade,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.facade.retrieve();
  }

  onAddClick() {
    this.dialog
      .open(AccountFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {},
      })
      .afterClosed()
      .subscribe((dialogData: Account) => {
        if (!dialogData) {
          return;
        }

        this.facade.add(dialogData);
      });
  }

  onEdit(account: Account) {
    this.dialog
      .open(AccountFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {
          account,
        },
      })
      .afterClosed()
      .subscribe((dialogData: Account | null) => {
        if (!dialogData) {
          return of();
        }

        this.facade.update(dialogData);
        return of();
      });
  }

  onDelete(account: Account) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this account?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.facade.delete(account);
        }
      });
  }
}
