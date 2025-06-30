export interface Question {
  questionId: number;
  text: string;
  category: string;
  difficulty: string;
  correctAnswer: string;
  options: string[];
}
