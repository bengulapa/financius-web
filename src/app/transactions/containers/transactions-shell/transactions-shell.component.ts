import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionState } from 'src/app/shared/models/financius.enums';
import { TransactionsFacade } from '../../state/transactions.facade';
import { TransactionFormDialogComponent } from '../transaction-form-dialog/transaction-form-dialog.component';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent implements OnInit {
  constructor(
    public facade: TransactionsFacade,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.facade.retrieve();
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
      .pipe(
        switchMap((dialogData: Transaction) => {
          if (!dialogData) {
            return of();
          }

          this.facade.add(this.createTransactionObject(dialogData));
          return of();
        })
      )
      .subscribe();
  }

  onEdit(transaction: Partial<Transaction>) {
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
      .pipe(
        switchMap((dialogData: Transaction | null) => {
          if (!dialogData) {
            return of();
          }

          this.facade.update(
            this.createTransactionObject(dialogData, dialogData.id)
          );
          return of();
        })
      )
      .subscribe();
  }

  onDelete(transaction: Transaction) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this transaction?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.facade.delete(transaction);
        }
      });
  }

  private createTransactionObject(
    dialogData: Transaction,
    id?: string
  ): Transaction {
    return {
      ...dialogData,
      id: id || Guid.newGuid(),
      date: new Date(dialogData.date!).getTime(),
      category: dialogData.category?.id ? dialogData.category : null,
      accountFrom: dialogData.accountFrom?.id ? dialogData.accountFrom : null,
      accountTo: dialogData.accountTo?.id ? dialogData.accountTo : null,
      currency:
        dialogData.accountFrom?.currency ||
        dialogData.accountTo?.currency ||
        null,
      transactionState: dialogData?.transactionState
        ? TransactionState.Confirmed
        : TransactionState.Pending,
    };
  }
}
