import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsFacade } from 'src/app/accounts/state/accounts.facade';
import { SymbolPosition } from 'src/app/shared/models/financius.enums';
import { CurrenciesFacade } from '../../state/currencies.facade';

@Component({
  selector: 'app-currency-view',
  templateUrl: './currency-view.component.html',
  styleUrls: ['./currency-view.component.scss'],
})
export class CurrencyViewComponent implements OnInit {
  SymbolPosition = SymbolPosition;

  constructor(
    public facade: CurrenciesFacade,
    public accountsFacade: AccountsFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.facade.getByKey(id);
      this.accountsFacade.retrieve();
    });
  }
}
