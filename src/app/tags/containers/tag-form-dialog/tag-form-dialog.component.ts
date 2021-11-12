import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-tag-form-dialog',
  templateUrl: './tag-form-dialog.component.html',
  styleUrls: ['./tag-form-dialog.component.scss'],
})
export class TagFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { tag: Tag }) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.tag;

    this.form = new FormGroup({
      id: new FormControl(this.data.tag?.id || ''),
      name: new FormControl(this.data.tag?.name || ''),
    });
  }
}
