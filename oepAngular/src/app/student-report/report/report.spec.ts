import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentReportsComponent } from './report';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

describe('StudentReportsComponent', () => {
  let component: StudentReportsComponent;
  let fixture: ComponentFixture<StudentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        MatFormFieldModule,
        StudentReportsComponent // Standalone component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});