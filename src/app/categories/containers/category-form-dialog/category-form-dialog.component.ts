import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorService } from 'src/app/core/services/color.service';
import { FormHelpers } from 'src/app/core/utilities/form.helpers';
import { Category } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  TransactionType = TransactionType;
  colors: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: Category },
    private formHelpers: FormHelpers,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.category;

    this.form = this.formHelpers.createCategoryForm(this.data.category);

    let colors = this.colorService.getMaterialColors();

    // if color is not on the array, add it to show it on the selection
    if (this.isEditMode) {
      colors = [this.data.category.color, ...colors];
    }

    this.colors = colors;
  }
}
