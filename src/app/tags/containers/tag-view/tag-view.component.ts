import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TagsService } from 'src/app/core/services/tags.service';
import { Tag, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.scss'],
})
export class TagViewComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  tag$?: Observable<Tag>;
  loading$?: Observable<boolean>;

  constructor(
    private service: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.loading$ = this.service.loading$;
      this.tag$ = this.service.getByKey(id);
      this.transactions$ = this.service.getTransactions(id);
    });
  }
}
