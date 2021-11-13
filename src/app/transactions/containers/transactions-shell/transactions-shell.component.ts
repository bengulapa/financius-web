import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Transaction } from 'src/app/shared/models/entities.models';
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
    this.entities$ = this.service.getTransactions();
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
          console.log(dialogData);
          return of(dialogData);
          // TODO handle cancel
          return this.service.add({
            ...dialogData,
            id: Guid.newGuid(),
          });
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
          console.log(dialogData);
          return of(dialogData);

          // TODO handle cancel
          return this.service.update(dialogData!);
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
