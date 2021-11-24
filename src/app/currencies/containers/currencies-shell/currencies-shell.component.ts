import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrenciesFacade } from '../../state/currencies.facade';
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
    public facade: CurrenciesFacade,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.facade.retrieve();
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
      .subscribe((dialogData: Currency) => {
        if (!dialogData) {
          return;
        }

        this.facade.add({
          ...dialogData,
          id: Guid.newGuid(),
        });
      });
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
      .subscribe((dialogData: Currency) => {
        if (!dialogData) {
          return;
        }

        return this.facade.update(dialogData);
      });
  }

  onDelete(currency: Currency) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this currency?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.facade.delete(currency);
        }
      });
  }
}
