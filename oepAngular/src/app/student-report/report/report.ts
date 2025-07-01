import { Component, OnInit } from '@angular/core';
import { ReportService, ReportSummaryDTO } from '../../services/report/report-service.service';
import { AuthService } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Explicitly import CommonModule
import { MatTableModule } from '@angular/material/table';
import { QuestionService } from '../../services/question/question-service';

@Component({
  selector: 'app-student-reports',
  standalone: true,
  imports: [
    CommonModule, // Required for *ngIf
    FormsModule,  // Required for [(ngModel)]
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatFormFieldModule
  ],
  templateUrl: './report.html',
  styleUrl: './report.css'
})
export class StudentReportsComponent implements OnInit {
  examCount: number = 0;
  rank: number = 0;
  userId: any;
  examId: number = 0;
  showReport = false;
  studentReports: any[] = []; 
  report?: ReportSummaryDTO;

  displayedColumns: string[] = ['reportId', 'examId', 'userId', 'totalMarks', 'performanceMetrics'];

  filterExamId: number | null = null; // Variable to store the filter input

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const examId = localStorage.getItem('examId');

    if (userId !== null) {
      this.userId = userId;
      this.loadExamCount();
      this.loadRank();
      this.loadStudentReports(); // Load all reports after userId is confirmed
    } else {
      this.snackBar.open('User ID not found. Please log in.', 'Close', { duration: 3000 });
    }
  }

  loadExamCount(): void {
    if (this.userId !== null) {
      this.reportService.getExamCount(this.userId).subscribe(
        res => this.examCount = res,
        err => this.snackBar.open('Error fetching exam count', 'Close', { duration: 3000 })
      );
    }
  }

  loadRank(): void {
    if (this.userId !== null) {
      this.reportService.getRank(this.userId).subscribe(
        res => this.rank = res,
        err => this.snackBar.open('Error fetching rank', 'Close', { duration: 3000 })
      );
    }
  }

  loadStudentReports(): void {
    if (this.userId !== null) {
      this.reportService.getReportsByUser(this.userId).subscribe(
        res => {
          this.studentReports = res;
          if (this.studentReports.length === 0) {
            this.snackBar.open('No reports found for this student.', 'Close', { duration: 3000 });
          }
        },
        err => this.snackBar.open('Error loading student reports', 'Close', { duration: 3000 })
      );
    }
  }

  filterReportsByExamId(): void {
    if (this.filterExamId !== null) {
      this.reportService.getReportsByUser(this.userId).subscribe(
        res => {
          console.log('Filter Exam ID:', this.filterExamId);
          console.log('Reports:', res);
          this.studentReports = res.filter(report => this.filterExamId !== null && report.examId.toString() === this.filterExamId.toString());
          if (this.studentReports.length === 0) {
            this.snackBar.open('No reports found for the given Exam ID.', 'Close', { duration: 3000 });
          }
        },
        err => this.snackBar.open('Error filtering reports', 'Close', { duration: 3000 })
      );
    } else {
      this.loadStudentReports(); // Reload all reports if no filter is applied
    }
  }
}