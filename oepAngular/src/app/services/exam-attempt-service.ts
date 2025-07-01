import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  questionId: number;
  text: string;
  category: string;
  difficulty: string;
  option1: string;
  option2: string;
}

export interface AnswerSubmission {
  questionId: number;
  submittedAnswer: string;
}

export interface ExamSubmission {
  userId: number;
  answers: AnswerSubmission[];
}

@Injectable({ providedIn: 'root' })
export class ExamServiceAttempt {
  private baseUrl = 'http://localhost:8090/api/questionbank';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/attemptQuestions`);
  }

  
}
