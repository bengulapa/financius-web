import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TagsService } from 'src/app/core/services/tags.service';
import { Tag } from 'src/app/shared/models/financius.models';

@Component({
  selector: 'app-tags-shell',
  templateUrl: './tags-shell.component.html',
  styleUrls: ['./tags-shell.component.scss'],
})
export class TagsShellComponent implements OnInit {
  tags$!: Observable<Tag[]>;

  constructor(private service: TagsService) {}

  ngOnInit(): void {
    this.tags$ = this.service.getAll();
  }
}
