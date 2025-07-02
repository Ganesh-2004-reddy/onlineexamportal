

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardTitle, MatCardActions } from '@angular/material/card';
import { Mapping,QuestionService, Question } from '../services/question/question-service';
import { ImportQuestionDialogComponent } from '../admin/import-question-dialog';
import { AddEditQuestionDialogComponent } from '../admin/add-edit-question-dialog';
import { RouterModule } from '@angular/router';
import { AdminHeader } from '../shared-components/admin-header/admin-header';
import { FooterComponent } from '../shared-components/footer/footer';

@Component({
  selector: 'app-manage-questions',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardActions,
    CommonModule,
    RouterModule,
    AdminHeader,
    FooterComponent,
  ],
  templateUrl: './manage-questions.html',
  styleUrls: ['./manage-questions.css']
})
export class ManageQuestionsComponent implements OnInit {
  examId!: number;
  questionBank: Question[] = [];
  mappedQuestionIds: number[] = [];
  mappings: Mapping[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    if (!this.examId) {
      alert('Invalid exam ID');
      return;
    }

    this.loadAllQuestions();
    this.loadMappedQuestions();
  }

  get questions(): Question[] {
    return this.questionBank;
  }

  loadAllQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: data => {
        this.questionBank = data.map(q => ({
  ...q,
  options: [q.option1, q.option2].filter(opt => !!opt)  // Ensure non-empty
}));
}
    });
  }

  loadMappedQuestions(): void {
    this.questionService.getMappingsForExam(this.examId).subscribe({
      next: mappings => {
        this.mappings = mappings;
        this.mappedQuestionIds = mappings.map(m => m.questionId);

        // Filter the questions from the bank that are mapped to this exam
        this.questionBank = this.questionBank.filter(q => this.mappedQuestionIds.includes(q.questionId));
      }
      
    });
  }

  importQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: allQuestions => {
        const dialogRef = this.dialog.open(ImportQuestionDialogComponent, {
          width: '600px',
          data: {
            questionBank: allQuestions,
            mappedQuestionIds: this.mappedQuestionIds,
            examId: this.examId
          }
        });

        dialogRef.afterClosed().subscribe((selectedIds: number[]) => {
          if (selectedIds?.length) {
            this.questionService.mapQuestions(this.examId, selectedIds).subscribe({
              next: () => this.loadMappedQuestions()
              
            });
          }
        });
      },
     
    });
  }

  mapSingleQuestion(questionId: number): void {
    this.questionService.mapQuestionToExam(this.examId, questionId).subscribe({
      next: () => {
       // alert('Question mapped successfully!');
        this.loadMappedQuestions();
      },

    });
  }

  addQuestion(): void {
    const dialogRef = this.dialog.open(AddEditQuestionDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((newQuestion: Question[]) => {
      if (newQuestion) {
        this.questionService.addQuestion(newQuestion).subscribe({
          next: added => {
            const addedQuestion = added[0];
            this.mapSingleQuestion(addedQuestion.questionId);
          }
        });
      }
    });
  }

  editQuestion(id: number): void {
    const question = this.questionBank.find(q => q.questionId === id);
    if (!question) return;

    const dialogRef = this.dialog.open(AddEditQuestionDialogComponent, {
      width: '600px',
      data: { question }
    });

    dialogRef.afterClosed().subscribe((updated: Question) => {
      if (updated) {
        this.questionService.updateQuestion(updated.questionId, updated).subscribe({
          next: () => this.loadMappedQuestions(),
          error: err => alert('Failed to update question: ' + err.error?.message || err.message)
        });
      }
    });
  }

  deleteQuestion(questionId: number): void {
  const mapping = this.mappings.find(m => m.questionId === questionId);

  console.log('Mappings:', this.mappings);
console.log('Question ID to unmap:', questionId);


  if (!mapping || !mapping.mappingId) {
    alert('Mapping not found or invalid mapping ID for this question.');
    console.error('Mapping object:', mapping);
    return;
  }

  if (confirm('Are you sure you want to unmap this question from the exam?')) {
    this.questionService.deleteMapping(mapping.mappingId).subscribe({
      next: () => {
        alert('Question unmapped successfully.');
        this.loadMappedQuestions();
      },
      error: err => alert('Failed to unmap question: ' + err.message)
    });
  }
}

}