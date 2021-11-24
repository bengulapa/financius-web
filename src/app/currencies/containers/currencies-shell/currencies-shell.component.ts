import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CurrenciesService } from 'src/app/core/services/currency.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrencyFormDialogComponent } from '../currency-form-dialog/currency-form-dialog.component';

@Component({
  selector: 'app-currencies-shell',
  templateUrl: './currencies-shell.component.html',
  styleUrls: ['./currencies-shell.component.scss'],
})
export class CurrenciesShellComponent
  extends EntityBaseComponent<Currency>
  implements OnInit
{
  constructor(
    private service: CurrenciesService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getAll();
    this.entities$ = this.service.entities$;
    this.loading$ = this.service.loading$;
  }

  onAddClick() {
    this.dialog
      .open(CurrencyFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {},
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Partial<Currency>) => {
          if (!dialogData) {
            return of();
          }

          return this.service.add({
            id: Guid.newGuid(),
            code: dialogData.code!,
            symbol: dialogData.symbol!,
            symbolPosition: dialogData.symbolPosition!,
            decimalSeparator: dialogData.decimalSeparator!,
            decimalCount: dialogData.decimalCount!,
            groupSeparator: dialogData.groupSeparator!,
          });
        })
      )
      .subscribe();
  }

  onEdit(currency: Currency) {
    this.dialog
      .open(CurrencyFormDialogComponent, {
        disableClose: true,
        width: '400px',
        maxHeight: '90vh',
        data: {
          currency,
        },
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Currency) => {
          if (!dialogData) {
            return of();
          }

          return this.service.update(dialogData);
        })
      )
      .subscribe();
  }

  onDelete(currency: Currency) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this currency?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.service.delete(currency.id);
          }
          return of();
        })
      )
      .subscribe((deletedKey) => {
        if (deletedKey) {
          this.notify.success('Currency has been deleted');
        }
      });
  }
}
