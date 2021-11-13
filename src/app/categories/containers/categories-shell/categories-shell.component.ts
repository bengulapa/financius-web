import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/shared/models/entities.models';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';

@Component({
  selector: 'app-categories-shell',
  templateUrl: './categories-shell.component.html',
  styleUrls: ['./categories-shell.component.scss'],
})
export class CategoriesShellComponent
  extends EntityBaseComponent<Category>
  implements OnInit
{
  constructor(private service: CategoriesService) {
    super();
  }

  ngOnInit(): void {
    this.entities$ = this.service.getCategories();
    this.loading$ = this.service.loading$;
  }
}
