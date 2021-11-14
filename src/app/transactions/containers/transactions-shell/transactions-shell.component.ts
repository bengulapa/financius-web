import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Transaction } from 'src/app/shared/models/entities.models';
import {
  TransactionState,
  TransactionType,
} from 'src/app/shared/models/financius.enums';
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
    private accountsService: AccountsService,
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

          // Update account 1st then save to updated account on the transaction

          return this.updateAccounts(this.createTransactionObject(dialogData));
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

          this.service.update(
            this.createTransactionObject(dialogData, dialogData.id)
          );

          return this.updateAccounts(dialogData);
        })
      )
      .subscribe();
  }

  onDelete(id: string) {
    this.service
      .getByKey(id)
      .pipe(
        switchMap((t) => {
          return this.updateAccounts(t, true);
        })
      )
      .subscribe(() => {
        this.notify.success('Transaction has been deleted');
      });
  }

  updateAccounts(transaction: Transaction, revert = false) {
    // If delete, restore the deleted amount
    const amount = revert ? transaction.amount * -1 : transaction.amount;

    switch (transaction.transactionType) {
      case TransactionType.Expense:
        this.accountsService
          .getByKey(transaction.accountFrom?.id)
          .pipe(
            switchMap((account) => {
              return this.accountsService.update({
                ...account,
                balance: account.balance - amount,
              });
            })
          )
          .subscribe((accountFrom) => {
            if (revert) {
              this.service.delete(transaction.id);
            } else {
              this.service.add({
                ...transaction,
                accountFrom,
              });
            }
          });
        return of();
        break;

      case TransactionType.Income:
        return this.accountsService.update({
          ...transaction.accountTo,
          balance: transaction.accountTo!.balance + amount,
        });

      case TransactionType.Transfer:
        return forkJoin([
          this.accountsService.update({
            ...transaction.accountFrom,
            balance: transaction.accountFrom!.balance - amount,
          }),
          this.accountsService.update({
            ...transaction.accountTo,
            balance: transaction.accountTo!.balance + amount,
          }),
        ]);
    }
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
