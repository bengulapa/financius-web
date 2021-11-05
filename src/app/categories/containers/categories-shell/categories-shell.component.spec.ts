import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesShellComponent } from './categories-shell.component';

describe('CategoriesShellComponent', () => {
  let component: CategoriesShellComponent;
  let fixture: ComponentFixture<CategoriesShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
