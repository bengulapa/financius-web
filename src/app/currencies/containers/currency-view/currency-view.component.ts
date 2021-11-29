import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SymbolPosition } from 'src/app/shared/models/financius.enums';
import { CurrencyActions } from '../../state/currencies.actions';
import { selectCurrencyPageViewModel } from '../../state/currencies.selectors';

@Component({
  selector: 'app-currency-view',
  templateUrl: './currency-view.component.html',
  styleUrls: ['./currency-view.component.scss'],
})
export class CurrencyViewComponent implements OnInit {
  readonly vm$ = this.store.select(selectCurrencyPageViewModel);

  SymbolPosition = SymbolPosition;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.store.dispatch(CurrencyActions.currencyViewOpened({ currencyId: id }));
    });
  }
}
