import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TagsService } from 'src/app/core/services/tags.service';
import { Tag } from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.scss'],
})
export class TagViewComponent implements OnInit {
  transactions$!: Observable<TransactionsViewModel[]>;
  tag$!: Observable<Tag | null>;

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

      this.tag$ = this.service.getById(id);
      this.transactions$ = this.service.getTransactions(id);
    });
  }
}
