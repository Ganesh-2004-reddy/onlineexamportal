import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentsComponent } from './view-student';

describe('ViewStudent', () => {
  let component: ViewStudentsComponent;
  let fixture: ComponentFixture<ViewStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
