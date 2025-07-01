import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExams } from './view-exams';

describe('ViewExams', () => {
  let component: ViewExams;
  let fixture: ComponentFixture<ViewExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewExams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
