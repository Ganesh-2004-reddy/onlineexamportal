import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-edit-question-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-edit-question-dialog.html',
  styleUrls: ['./add-edit-question-dialog.css']
})
export class AddEditQuestionDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      questionId: [data?.question?.questionId || null],
      text: [data?.question?.text || '', Validators.required],
      category: [data?.question?.category || '', Validators.required],
      difficulty: [data?.question?.difficulty || '', Validators.required],
      correctAnswer: [data?.question?.correctAnswer || '', Validators.required],
      option1: [data?.question?.option1 || '', Validators.required],
      option2: [data?.question?.option2 || '', Validators.required]
    });
  }

  save() {
    const formValue = this.form.value;
    this.dialogRef.close(formValue); // Now it returns fields matching backend
  }

  cancel() {
    this.dialogRef.close();
  }
}
