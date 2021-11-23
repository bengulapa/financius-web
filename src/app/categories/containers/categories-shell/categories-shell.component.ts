import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/shared/models/entities.models';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-categories-shell',
  templateUrl: './categories-shell.component.html',
  styleUrls: ['./categories-shell.component.scss'],
})
export class CategoriesShellComponent
  extends EntityBaseComponent<Category>
  implements OnInit
{
  constructor(
    private service: CategoriesService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getCategories();
    this.entities$ = this.service.entities$;
    this.loading$ = this.service.loading$;
  }

  onAddClick() {
    this.dialog
      .open(CategoryFormDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {},
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Partial<Category>) => {
          if (!dialogData) {
            return of();
          }

          return this.service.add({
            id: Guid.newGuid(),
            name: dialogData.name!,
            color: dialogData.color!,
            transactionType: dialogData.transactionType!,
            // TODO: set this
            sortOrder: 0,
          });
        })
      )
      .subscribe();
  }

  onEdit(category: Category) {
    this.dialog
      .open(CategoryFormDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          category,
        },
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Partial<Category>) => {
          if (!dialogData) {
            return of();
          }

          return this.service.update(dialogData);
        })
      )
      .subscribe();
  }

  onDelete(category: Category) {
    this.notify
      .confirm({
        content: 'Are you sure you want to delete this category?',
        okButtonColor: 'warn',
        okButtonText: 'Delete',
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.service.delete(category.id);
          }
          return of();
        })
      )
      .subscribe((deletedKey) => {
        if (deletedKey) {
          this.notify.success('Category has been deleted');
        }
      });
  }
}
