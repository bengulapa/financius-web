import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
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

  @Output()
  categorySelected = new EventEmitter<Category>();

  @Output()
  accountSelected = new EventEmitter<{ account: Account; isFrom: boolean }>();

  @Output()
  tagsSelected = new EventEmitter<Tag[]>();

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

  setCategory(id: string) {
    const category = this.categories?.find((c) => c.id === id);
    this.categorySelected.emit(category);
  }

  setAccount(id: string, isFrom: boolean) {
    const account = this.accounts?.find((c) => c.id === id)!;
    this.accountSelected.emit({
      account,
      isFrom,
    });
  }

  setTags(ids: string[]) {
    const tags = this.tags?.filter((t) => ids.includes(t.id));
    this.tagsSelected.emit(tags);
  }
}
