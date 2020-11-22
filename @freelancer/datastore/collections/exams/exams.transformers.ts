import { ExamAjax } from './exams.backend-model';
import { Exam } from './exams.model';

export function transformExams(exam: ExamAjax): Exam {
  return {
    id: exam.id,
    insigniaId: exam.insignia_id,
    name: exam.name,
  };
}
