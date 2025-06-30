import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResponseSummary {
  responseId: number;
  questionId: number;
  submittedAnswer: string;
  marksObtained: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly baseUrl = 'http://localhost:8090/api/exam-management';

  constructor(private http: HttpClient) {}

  getResult(examId: number, userId: number): Observable<ResponseSummary[]> {
    return this.http.get<ResponseSummary[]>(`${this.baseUrl}/${examId}/responses/user/${userId}`);
  }
}
