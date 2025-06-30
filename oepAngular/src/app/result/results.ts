// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ResultService, ResponseSummary } from '../services/result-service';
// import { ActivatedRoute } from '@angular/router';
 import { MatCard } from '@angular/material/card';
 import { MatCardContent } from '@angular/material/card';
 import { MatCardTitle } from '@angular/material/card';
 import { MatToolbar } from '@angular/material/toolbar';
 import { UserHeaderComponent } from '../shared-components/user-header/user-header';
 import { FooterComponent } from '../shared-components/footer/footer';

// @Component({
//   selector: 'app-results',
//   standalone: true,
//   imports: [MatCard, MatCardContent, MatCardTitle, MatToolbar, CommonModule, UserHeaderComponent, FooterComponent],
//   templateUrl: './results.html',
//   styleUrls: ['./results.css']
// })
// export class ResultsComponent implements OnInit {
//   examId!: number;
//   userId!: number;
//   results: ResponseSummary[] = [];
//   totalMarks = 0;
//   isLoading = true;

//   constructor(private resultService: ResultService, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.examId = Number(localStorage.getItem('examId'));
//     this.userId = Number(localStorage.getItem('userId'));

//     if (!this.examId || !this.userId) {
//       alert('Missing exam or user information');
//       return;
//     }

//     this.resultService.getResult(this.examId, this.userId).subscribe({
//       next: (res) => {
//         this.results = res;
//         this.totalMarks = res.reduce((sum, r) => sum + r.marksObtained, 0);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         alert('Failed to load results: ' + err.message);
//         this.isLoading = false;
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService, Exam, ResponseSummaryDTO } from '../services/exam-service';
import { QuestionService,Question } from '../services/question/question-service';
import { ResultService } from '../services/result-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardTitle, MatToolbar, CommonModule, UserHeaderComponent, FooterComponent],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class ResultsComponent implements OnInit {
  examId!: number;
  userId!: number;
  isLoading = true;
  examDetails!: Exam;
  totalMarks = 0;

  // final structure: [{ question: Question, response: ResponseSummaryDTO }]
  detailedResults: {
    question: Question;
    response: ResponseSummaryDTO;
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private resultService:ResultService
  ) {}

  ngOnInit(): void {
    this.examId = Number(localStorage.getItem('examId'));
    this.userId = Number(localStorage.getItem('userId'));

    if (!this.examId || !this.userId) {
      alert('Missing exam or user ID');
      return;
    }

    this.loadResults();
  }

  // loadResults() {
  //   this.resultService.getResult(this.examId, this.userId).subscribe({
  //     next: (responses) => {
  //       const fetches = responses.map(response =>
  //         this.questionService.getQuestionById(response.questionId).toPromise().then(question => ({
  //           question,
  //           response
  //         }))
  //       );

  //       Promise.all(fetches).then(results => {
  //         this.detailedResults = results;
  //         this.totalMarks = results.reduce((sum, r) => sum + (r.response.marksObtained || 0), 0);
  //         this.loadExamDetails(); // load exam info like title, duration
  //       });
  //     },
  //     error: err => {
  //       alert('Failed to load results: ' + err.message);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  loadResults() {
  this.resultService.getResult(this.examId, this.userId).subscribe({
    next: (responses) => {
      const fetches = responses.map(response =>
        this.questionService.getQuestionById(response.questionId).toPromise().then(question => {
          if (!question) {
            console.warn(`Question not found for ID ${response.questionId}`);
            return null;
          }
          return { question, response };
        })
      );

      Promise.all(fetches).then(results => {
        // Filter out any nulls (where question was not found)
        this.detailedResults = results.filter(
          (item): item is { question: Question; response: ResponseSummaryDTO } => item !== null
        );

        this.totalMarks = this.detailedResults.reduce(
          (sum, r) => sum + (r.response.marksObtained || 0),
          0
        );

        this.loadExamDetails(); // Load title/description
        this.isLoading = false;
      });
    },
    error: err => {
      alert('Failed to load results: ' + err.message);
      this.isLoading = false;
    }
  });
}


  loadExamDetails() {
    this.examService.getExamById(this.examId).subscribe({
      next: exam => {
        this.examDetails = exam;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load exam details');
      }
    });
  }
}
