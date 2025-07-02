import { TestBed } from '@angular/core/testing';

import { ExamServiceAttempt } from './exam-attempt-service';

describe('ExamAttemptService', () => {
  let service: ExamServiceAttempt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamServiceAttempt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
