import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsShellComponent } from './tags-shell.component';

describe('TagsShellComponent', () => {
  let component: TagsShellComponent;
  let fixture: ComponentFixture<TagsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
