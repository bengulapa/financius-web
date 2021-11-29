import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionState } from 'src/app/shared/models/financius.enums';
import { TransactionActions } from '../../state/transactions.actions';
import { selectTransactionsIndexViewModel } from '../../state/transactions.selectors';
import { TransactionFormDialogComponent } from '../transaction-form-dialog/transaction-form-dialog.component';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent implements OnInit {
  readonly vm$ = this.store.select(selectTransactionsIndexViewModel);

  constructor(private dialog: MatDialog, private notify: NotificationService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(TransactionActions.indexPageOpened());
  }

  onAddClick() {
    this.dialog
      .open(TransactionFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {},
      })
      .afterClosed()
      .pipe(filter((d) => !!d))
      .subscribe((dialogData: Transaction) => {
        this.store.dispatch(
          TransactionActions.add({
            transaction: this.createTransactionObject(dialogData),
          })
        );
      });
  }

  onEdit(transaction: Transaction) {
    this.dialog
      .open(TransactionFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {
          transaction,
        },
      })
      .afterClosed()
      .pipe(filter((d) => !!d))
      .subscribe((dialogData: Transaction) => {
        this.store.dispatch(
          TransactionActions.update({
            old: transaction,
            update: this.createTransactionObject(dialogData, dialogData.id),
          })
        );
      });
  }

  onDelete(transaction: Transaction) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this transaction?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .pipe(filter((d) => !!d))
      .subscribe(() => {
        this.store.dispatch(TransactionActions.remove({ transaction }));
      });
  }

  private createTransactionObject(dialogData: Transaction, id?: string): Transaction {
    return {
      ...dialogData,
      id: id || Guid.newGuid(),
      date: new Date(dialogData.date!).getTime(),
      category: dialogData.category?.id ? dialogData.category : null,
      accountFrom: dialogData.accountFrom?.id ? dialogData.accountFrom : null,
      accountTo: dialogData.accountTo?.id ? dialogData.accountTo : null,
      currency: dialogData.accountFrom?.currency || dialogData.accountTo?.currency || null,
      transactionState: dialogData?.transactionState ? TransactionState.Confirmed : TransactionState.Pending,
      tags: dialogData.tags || [],
    };
  }
}
