import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Account, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent implements OnInit {
  @Input()
  account!: Account | null;

  @Input()
  transactions?: Transaction[] | null;

  @Input()
  loading?: boolean | null;

  constructor() {}

  ngOnInit(): void {}
}
