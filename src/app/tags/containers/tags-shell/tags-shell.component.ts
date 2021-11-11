import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TagsService } from 'src/app/core/services/tags.service';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { Tag } from 'src/app/shared/models/financius.models';
import { TagFormDialogComponent } from '../tag-form-dialog/tag-form-dialog.component';

@Component({
  selector: 'app-tags-shell',
  templateUrl: './tags-shell.component.html',
  styleUrls: ['./tags-shell.component.scss'],
})
export class TagsShellComponent implements OnInit {
  tags$!: Observable<Tag[]>;

  constructor(
    private service: TagsService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTags();
  }

  private loadTags() {
    this.tags$ = this.service.getAll();
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
            title: dialogData.title,
            id: Guid.newGuid(),
          });
        })
      )
      .subscribe(() => {
        this.loadTags();
      });
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
      .subscribe(() => {
        this.loadTags();
      });
  }

  onDelete(id: string) {
    this.service.delete(id).subscribe(() => {
      this.loadTags();
      this.notify.success('Tag has been deleted');
    });
  }
}
