import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsShellComponent } from './reports-shell.component';

describe('ReportsShellComponent', () => {
  let component: ReportsShellComponent;
  let fixture: ComponentFixture<ReportsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
