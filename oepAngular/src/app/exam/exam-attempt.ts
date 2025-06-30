import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../services/exam-service';
import { ReportService } from '../services/report/report-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exam-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatRadioModule, MatToolbarModule],
  templateUrl: './exam-attempt.html',
  styleUrl: './exam-attempt.css'
})
export class ExamAttemptComponent implements OnInit {
  examDetails: any;
  examId!: number;
  userId!: number;
  timer: any;
  timeLeft: number = 0;
  questions: any[] = [];
  answers: { [key: number]: string } = {};
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.examId = +parseInt(localStorage.getItem('examId') || '0');
    this.userId = +localStorage.getItem('userId')!;
    this.loadQuestions();
  }

  loadQuestions() {
    this.examService.getQuestionsByExamId(this.examId).subscribe({
      next: (data: any) => {
        this.examDetails = data.examDetails;
        this.questions = data.questions;
        this.isLoading = false;

        const durationInMinutes = this.examDetails.duration;
        this.startTimer(durationInMinutes * 60);
      },
      error: (err) => {
        this.snackBar.open('Failed to load questions: ' + err.message, 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  startTimer(seconds: number) {
    this.timeLeft = seconds;
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  submitExam() {
    clearInterval(this.timer); // Stop the timer when the exam is submitted

    const answers = Object.entries(this.answers).map(([questionId, submittedAnswer]) => ({
      questionId: Number(questionId),
      submittedAnswer
    }));

    const submission = { userId: this.userId, answers };

    // Correct API endpoint for submitting responses
    this.examService.submitExam(this.examId, submission).subscribe({
      next: () => {
        this.snackBar.open('Responses submitted successfully!', 'Close', { duration: 3000 });

        // Call the Report microservice to generate the report
        this.generateReport();
      },
      error: (err) => {
        this.snackBar.open('Failed to submit responses: ' + err.message, 'Close', { duration: 3000 });
      }
    });
  }

  generateReport() {
    this.reportService.createReport(this.userId, this.examId).subscribe({
      next: (report) => {
        this.snackBar.open('Report generated successfully!', 'Close', { duration: 3000 });

        // Redirect to the results page
        this.router.navigate(['/results'], { queryParams: { examId: this.examId, userId: this.userId } });
      },
      error: (err) => {
        this.snackBar.open('Failed to generate report: ' + err.message, 'Close', { duration: 3000 });
      }
    });
  }
}
