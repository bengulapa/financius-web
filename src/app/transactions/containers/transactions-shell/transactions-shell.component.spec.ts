import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsShellComponent } from './transactions-shell.component';

describe('TransactionsShellComponent', () => {
  let component: TransactionsShellComponent;
  let fixture: ComponentFixture<TransactionsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
