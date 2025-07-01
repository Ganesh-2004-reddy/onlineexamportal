// view-exams.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExamService,Exam } from '../../../../services/exam-service';



@Component({
  selector: 'app-view-exams',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './view-exams.html',
  styleUrls: ['./view-exams.css']
})
export class ViewExamsComponent implements OnInit {
  exams: Exam[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.examService.getAllExams().subscribe({
      next: (data) => this.exams = data,
      error: (err) => {
        console.error('Failed to load exams:', err);
        alert('Unable to fetch exams');
      }
    });
  }
}
