import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Account,
  FinanciusBackup,
} from 'src/app/shared/models/financius.models';
import * as data from 'src/assets/data.json';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  data: FinanciusBackup = data;

  constructor() {}

  get(): Observable<Account[]> {
    return of(
      this.data.accounts.sort((a, b) => this.sortByName(a.title, b.title))
    );
  }

  private sortByName(a: string, b: string) {
    var nameA = a.toUpperCase(); // ignore upper and lowercase
    var nameB = b.toUpperCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}
