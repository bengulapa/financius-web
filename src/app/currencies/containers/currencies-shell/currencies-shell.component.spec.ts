import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenciesShellComponent } from './currencies-shell.component';

describe('CurrenciesShellComponent', () => {
  let component: CurrenciesShellComponent;
  let fixture: ComponentFixture<CurrenciesShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrenciesShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrenciesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
