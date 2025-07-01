import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerHome } from './examiner-home';

describe('ExaminerHome', () => {
  let component: ExaminerHome;
  let fixture: ComponentFixture<ExaminerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaminerHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
