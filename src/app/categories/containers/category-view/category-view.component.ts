import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss'],
})
export class CategoryViewComponent implements OnInit {
  transactions$!: Observable<TransactionsViewModel[]>;
  category$!: Observable<Category | null>;

  constructor(
    private service: CategoriesService,
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

      this.category$ = this.service.get(id);
      this.transactions$ = this.service.getTransactions(id);
    });
  }
}
