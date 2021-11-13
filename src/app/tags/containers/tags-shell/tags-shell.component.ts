import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TagsService } from 'src/app/core/services/tags.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Tag } from 'src/app/shared/models/entities.models';
import { TagFormDialogComponent } from '../tag-form-dialog/tag-form-dialog.component';

@Component({
  selector: 'app-tags-shell',
  templateUrl: './tags-shell.component.html',
  styleUrls: ['./tags-shell.component.scss'],
})
export class TagsShellComponent
  extends EntityBaseComponent<Tag>
  implements OnInit
{
  constructor(
    private service: TagsService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.entities$ = this.service.getTags();
    this.loading$ = this.service.loading$;
  }

  onAddClick() {
    this.dialog
      .open(TagFormDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {},
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Partial<Tag>) => {
          return this.service.add({
            name: dialogData.name!,
            id: Guid.newGuid(),
          });
        })
      )
      .subscribe();
  }

  onEdit(tag: Partial<Tag>) {
    this.dialog
      .open(TagFormDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          tag,
        },
      })
      .afterClosed()
      .pipe(
        switchMap((dialogData: Partial<Tag>) => {
          return this.service.update(dialogData);
        })
      )
      .subscribe();
  }

  onDelete(id: string) {
    this.service.delete(id).subscribe(() => {
      this.notify.success('Tag has been deleted');
    });
  }
}
