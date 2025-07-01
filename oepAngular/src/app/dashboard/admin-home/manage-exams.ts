import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ExamDialogComponent } from '../../admin/exam-dialog';
import { ExamService, Exam } from '../../services/exam-service';
import { AdminHeader } from '../../shared-components/admin-header/admin-header';
import { FooterComponent } from '../../shared-components/footer/footer';


@Component({
  standalone: true,
  selector: 'app-manage-exams',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    RouterModule,
    AdminHeader,
    FooterComponent
],
  templateUrl: './manage-exams.html',
  styleUrls: ['./manage-exams.css']
})
export class ManageExamsComponent implements OnInit {
  exams: Exam[] = [];

  constructor(private dialog: MatDialog, private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.examService.getAllExams().subscribe({
      next: (data) => {
        this.exams = data;
      },
      error: (err) => {
        console.error('Failed to fetch exams:', err);
      }
    });
  }

  createExam() {
    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.createExam(result).subscribe({
          next: () => this.loadExams(),
          error: err => alert('Failed to create exam: ' + err.error.message)
        });
      }
    });
  }

  editExam(examId: number) {
    const exam = this.exams.find(e => e.examId === examId);
    if (!exam) return;

    const dialogRef = this.dialog.open(ExamDialogComponent, {
      width: '500px',
      data: exam
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examService.updateExam(examId, result).subscribe({
          next: () => this.loadExams(),
          error: err => alert('Failed to update exam: ' + err.error.message)
        });
      }
    });
  }

  deleteExam(examId: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => this.loadExams(),
        error: err => alert('Failed to delete exam: ' + err.error.message)
      });
    }
  }
}
