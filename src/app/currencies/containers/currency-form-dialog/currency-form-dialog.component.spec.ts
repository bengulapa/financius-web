import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyFormDialogComponent } from './currency-form-dialog.component';

describe('CurrencyFormDialogComponent', () => {
  let component: CurrencyFormDialogComponent;
  let fixture: ComponentFixture<CurrencyFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
