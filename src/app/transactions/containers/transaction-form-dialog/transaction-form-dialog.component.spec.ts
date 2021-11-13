import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFormDialogComponent } from './transaction-form-dialog.component';

describe('TransactionFormDialogComponent', () => {
  let component: TransactionFormDialogComponent;
  let fixture: ComponentFixture<TransactionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
