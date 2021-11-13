import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/shared/models/entities.models';
import { ObservableBaseComponent } from 'src/app/shared/observable-base.component';

@Component({
  selector: 'app-categories-shell',
  templateUrl: './categories-shell.component.html',
  styleUrls: ['./categories-shell.component.scss'],
})
export class CategoriesShellComponent
  extends ObservableBaseComponent
  implements OnInit
{
  categories$!: Observable<Category[]>;

  constructor(private service: CategoriesService) {
    super();
  }

  ngOnInit(): void {
    this.categories$ = this.service.getCategories();
  }
}
