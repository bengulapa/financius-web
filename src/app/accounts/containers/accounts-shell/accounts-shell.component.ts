import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { Account } from 'src/app/shared/models/entities.models';
import { AccountActions } from '../../state/accounts.actions';
import { selectAccountsPageViewModel, selectAccountTransactionsById } from '../../state/accounts.selectors';
import { AccountFormDialogComponent } from '../account-form-dialog/account-form-dialog.component';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent implements OnInit {
  readonly vm$ = this.store.select(selectAccountsPageViewModel);

  constructor(private dialog: MatDialog, private notify: NotificationService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AccountActions.accountsPageOpened());
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

        this.store.dispatch(
          AccountActions.add({
            account: {
              ...dialogData,
              id: Guid.newGuid(),
            },
          })
        );
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
          return;
        }

        this.store.dispatch(AccountActions.update({ old: account, update: dialogData }));
      });
  }

  onDelete(account: Account) {
    this.store
      .select(selectAccountTransactionsById(account.id))
      .pipe(
        first((t) => !!t),
        switchMap((t) => {
          return this.notify
            .confirm({
              title: `Are you sure you want to delete this account?`,
              content: `1 account will be deleted ${t.length > 0 ? `<br> ${t.length} transactions will be deleted` : ''}`,
              okButtonColor: 'warn',
              okButtonText: 'Delete',
            })
            .afterClosed();
        })
      )
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(AccountActions.remove({ account }));
        }
      });
  }
}
