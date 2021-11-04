import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsShellComponent } from './accounts-shell.component';

describe('AccountsShellComponent', () => {
  let component: AccountsShellComponent;
  let fixture: ComponentFixture<AccountsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
