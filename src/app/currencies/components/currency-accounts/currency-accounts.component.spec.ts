import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAccountsComponent } from './currency-accounts.component';

describe('CurrencyAccountsComponent', () => {
  let component: CurrencyAccountsComponent;
  let fixture: ComponentFixture<CurrencyAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
