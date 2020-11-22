import { AcademyInstructorAjax } from './academy-instructors.backend-model';
import { AcademyInstructor } from './academy-instructors.model';

export function transformInstructors(
  instructor: AcademyInstructorAjax,
): AcademyInstructor {
  return {
    id: instructor.id,
    userId: instructor.user_id,
    firstName: instructor.first_name,
    lastName: instructor.last_name,
    description: instructor.description,
    jobTitle: instructor.job_title,
    enabled: instructor.enabled,
    studentCount: instructor.student_count,
    profileImage: instructor.profile_image,
    rating: instructor.rating,
  };
}
