import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Account, Category, Tag } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent implements OnChanges {
  @Input()
  form!: FormGroup;

  @Input()
  accounts?: Account[] | null;

  @Input()
  categories?: Category[] | null;

  @Input()
  tags?: Tag[] | null;

  TransactionType = TransactionType;

  get selectedTransactionType(): TransactionType {
    return this.form.get('transactionType')?.value;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accounts?.currentValue?.length) {
      this.accounts = _.orderBy(
        this.accounts,
        ['includeInTotals', 'name'],
        ['desc', 'asc']
      );
    }

    if (changes.categories?.currentValue?.length) {
      this.categories = _.orderBy(this.categories, ['name'], ['asc']);
    }

    if (changes.tags?.currentValue?.length) {
      this.tags = _.orderBy(this.tags, ['name'], ['asc']);
    }
  }
}
