import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenciesTableComponent } from './currencies-table.component';

describe('CurrenciesTableComponent', () => {
  let component: CurrenciesTableComponent;
  let fixture: ComponentFixture<CurrenciesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrenciesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrenciesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
