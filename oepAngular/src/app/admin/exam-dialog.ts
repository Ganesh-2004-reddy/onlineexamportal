import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exam-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './exam-dialog.html',
  styleUrls: ['./exam-dialog.css']
})
export class ExamDialogComponent {
  examForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ExamDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any // can be null or existing exam
  ) {
    this.isEditMode = !!data?.examId;

    this.examForm = this.fb.group({
      examId: [data?.examId || null],
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
      duration: [data?.duration || 30, [Validators.required, Validators.min(1)]],
      totalMarks: [data?.totalMarks || 100, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.examForm.valid) {
      this.dialogRef.close(this.examForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}