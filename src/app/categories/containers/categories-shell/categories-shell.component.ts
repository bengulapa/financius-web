import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/shared/models/financius.models';

@Component({
  selector: 'app-categories-shell',
  templateUrl: './categories-shell.component.html',
  styleUrls: ['./categories-shell.component.scss'],
})
export class CategoriesShellComponent implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(private service: CategoriesService) {}

  ngOnInit(): void {
    this.categories$ = this.service.get();
  }
}
