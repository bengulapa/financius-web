import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendsCardComponent } from './trends-card.component';

describe('TrendsCardComponent', () => {
  let component: TrendsCardComponent;
  let fixture: ComponentFixture<TrendsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
