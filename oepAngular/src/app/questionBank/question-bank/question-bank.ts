import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuestionService, Question } from '../../services/question/question-service';
import { AddEditQuestionDialogComponent } from '../../admin/add-edit-question-dialog';
import { AdminHeader } from '../../shared-components/admin-header/admin-header';
import{ FooterComponent } from '../../shared-components/footer/footer';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    AddEditQuestionDialogComponent,
    AdminHeader,
    FooterComponent
  ],
  templateUrl: './question-bank.html',
  styleUrls: ['./question-bank.css']
})
export class QuestionBankComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];

  categories: string[] = [];
  difficulties: string[] = ['easy', 'medium', 'hard'];

  selectedCategory: string = '';
  selectedDifficulty: string = '';

  constructor(private questionService: QuestionService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
  next: (data) => {
    this.questions = data.map(q => ({
      ...q,
      options: [q.option1, q.option2].filter(opt => !!opt)  // create options array
    }));
    this.filteredQuestions = this.questions;
    this.categories = [...new Set(this.questions.map(q => q.category))];
  },
  error: (err) => alert('Failed to load questions: ' + err.message)
});

  }

  filterQuestions(): void {
  if (this.selectedCategory && !this.selectedDifficulty) {
    this.questionService.getQuestionsByCategory(this.selectedCategory).subscribe({
      next: data => this.filteredQuestions = data,
      error: err => alert('Failed to filter by category: ' + err.message)
    });
  } else if (!this.selectedCategory && this.selectedDifficulty) {
    this.questionService.getQuestionsByDifficulty(this.selectedDifficulty).subscribe({
      next: data => this.filteredQuestions = data,
      error: err => alert('Failed to filter by difficulty: ' + err.message)
    });
  } else if (this.selectedCategory && this.selectedDifficulty) {
    // Fetch both separately and intersect results
    this.questionService.getQuestionsByCategory(this.selectedCategory).subscribe({
      next: categoryResults => {
        this.questionService.getQuestionsByDifficulty(this.selectedDifficulty).subscribe({
          next: difficultyResults => {
            const categoryIds = categoryResults.map(q => q.questionId);
            this.filteredQuestions = difficultyResults.filter(q => categoryIds.includes(q.questionId));
          },
          error: err => alert('Difficulty filter failed: ' + err.message)
        });
      },
      error: err => alert('Category filter failed: ' + err.message)
    });
  } else {
    this.filteredQuestions = this.questions;
  }
}


  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.filteredQuestions = this.questions;
  }

  addQuestion(): void {
    const dialogRef = this.dialog.open(AddEditQuestionDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((newQuestion: Question[]) => {
      if (newQuestion) {
        this.questionService.addQuestion(newQuestion).subscribe({
          next: () => this.loadQuestions(),
          error: err => alert('Failed to add question: ' + err.message)
        });
      }
    });
  }

  editQuestion(question: Question): void {
    const dialogRef = this.dialog.open(AddEditQuestionDialogComponent, {
      width: '600px',
      data: { question }
    });

    dialogRef.afterClosed().subscribe((updated: Question) => {
      if (updated) {
        this.questionService.updateQuestion(updated.questionId, updated).subscribe({
          next: () => this.loadQuestions(),
          error: err => alert('Failed to update question: ' + err.message)
        });
      }
    });
  }

  deleteQuestion(id: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => this.loadQuestions(),
        error: err => alert('Failed to delete question: ' + err.message)
      });
    }
  }

  uploadCSV(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.questionService.uploadCSV(formData).subscribe({
      next: () => {
        window.location.reload(); 
        this.loadQuestions();
      }
    });
  }
}
