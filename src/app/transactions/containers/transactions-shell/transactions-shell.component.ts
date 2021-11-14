import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionState } from 'src/app/shared/models/financius.enums';
import { TransactionFormDialogComponent } from '../transaction-form-dialog/transaction-form-dialog.component';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent
  extends EntityBaseComponent<Transaction>
  implements OnInit
{
  constructor(
    private service: TransactionsService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getTransactions();
    this.entities$ = this.service.entities$;
    this.loading$ = this.service.loading$;
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

          return this.service.add(this.createTransactionObject(dialogData));
        })
      )
      .subscribe();
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

          return this.service.update(
            this.createTransactionObject(dialogData, dialogData.id)
          );
        })
      )
      .subscribe();
  }

  onDelete(id: string) {
    this.service.delete(id).subscribe(() => {
      this.notify.success('Transaction has been deleted');
    });
  }
}
