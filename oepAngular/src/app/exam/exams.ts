import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
 import { ExamService } from '../services/exam-service';
 import { UserHeaderComponent } from '../shared-components/user-header/user-header';
 import { FooterComponent } from '../shared-components/footer/footer';

interface Exam {
  examId: number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  status?: 'Attempted' | 'Not Attempted';
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    UserHeaderComponent,
    FooterComponent
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  userId: number = Number(localStorage.getItem('userId'));

  constructor(
    private examService: ExamService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examService.getAllExams().subscribe({
      next: (data) => {
        this.exams = data.map(exam => ({ ...exam, status: 'Not Attempted' }));
        this.checkAttemptedExams();
      },
      error: () => alert('Failed to load exams')
    });
  }
  

  checkAttemptedExams() {
    this.exams.forEach(exam => {
      const url = `http://localhost:8090/api/exam-management/exam/${exam.examId}/user/${this.userId}`;
      this.http.get(url).subscribe({
        next: () => exam.status = 'Attempted',
        error: () => exam.status = 'Not Attempted'
      });
    });
  }

  startExam(examId: number): void {
    const exam = this.exams.find(e => e.examId === examId);
    if (exam?.status === 'Attempted') {
      alert('You have already attempted this exam.');
      return;
    }
    localStorage.setItem('examId', examId.toString());
    this.router.navigate(['/exam', examId]);
  }

  updateProfile(): void {
    this.router.navigate(['/update-profile']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
