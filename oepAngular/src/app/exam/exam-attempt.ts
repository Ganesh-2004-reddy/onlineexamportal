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
  intervalId: any;
  questions: any[] = [];
  answers: { [key: number]: string } = {};
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.examId = +parseInt(localStorage.getItem('examId')||'0');   
    this.userId = +localStorage.getItem('userId')!;
    this.loadQuestions();
    
    
  }

  loadQuestions() {
    this.examService.getQuestionsByExamId(this.examId).subscribe({
      next: (data:any) => {
        console.log('Raw questions:', data);
        this.examDetails = data.examDetails;
        this.questions = data.questions;
        this.isLoading = false;

        const durationInMinutes = this.examDetails.duration;
    this.startTimer(durationInMinutes * 60);
      },
      error: (err) => {
        console.error('Failed to load questions', err);
        alert('Failed to load questions');
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

  // formatTime(): string {
  //   const minutes = Math.floor(this.timer / 60);
  //   const seconds = this.timer % 60;
  //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // }
  formatTime(): string {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
}

padZero(num: number): string {
  return num < 10 ? '0' + num : '' + num;
}

  // submitExam() {
  //   clearInterval(this.intervalId);

  //   const answersList: AnswerSubmissionDTO[] = Object.keys(this.answers).map((qid) => ({
  //     questionId: +qid,
  //     submittedAnswer: this.answers[+qid]
  //   }));

  //   const submission: ExamSubmissionDTO = {
  //     userId: this.userId,
  //     answers: answersList
  //   };

  //   this.examService.submitExam(this.examId, submission).subscribe({
  //     next: (res) => {
  //       alert('Exam submitted successfully!');
  //       this.router.navigate(['/results'], { state: { examId: this.examId, userId: this.userId } });
  //     },
  //     error: (err) => {
  //       console.error('Error submitting exam', err);
  //       alert('Failed to submit exam');
  //     }
  //   });
  // }
  submitExam() {
  const userId = Number(localStorage.getItem('userId'));

  const answers = Object.entries(this.answers).map(([questionId, submittedAnswer]) => ({
    questionId: Number(questionId),
    submittedAnswer
  }));

  const submission = { userId, answers };

  this.examService.submitExam(this.examId, submission).subscribe({
    next: (result) => {
      this.router.navigate(['/results',this.examId], { state: { result, examTitle: this.examDetails.title } });
    },
    error: (err) => alert('Exam submission failed: ' + (err.error?.message || err.message))
  });
}

}
