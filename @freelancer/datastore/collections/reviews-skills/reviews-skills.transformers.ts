import { JobApi } from 'api-typings/common/common';
import { ReviewsSkillsApi } from 'api-typings/projects/projects';
import { ReviewSkill, ReviewsSkills } from './reviews-skills.model';

export function transformReviewsSkills(
  reviewsSkills: ReviewsSkillsApi,
): ReviewsSkills {
  // Set id as a combination of user id and set filters
  let id: string;
  if (reviewsSkills.to_user) {
    id = `to_user_${reviewsSkills.to_user}_${reviewsSkills.role}`;
  } else if (reviewsSkills.from_user) {
    id = `from_user_${reviewsSkills.from_user}_${reviewsSkills.role}`;
  } else {
    throw Error('No user ids have been found.');
  }
  return {
    id,
    skills: reviewsSkills.skills.map(skill => transformReviewSkill(skill)),
    toUser: reviewsSkills.to_user,
    fromUser: reviewsSkills.from_user,
    reviewType: reviewsSkills.review_type,
    role: reviewsSkills.role,
  };
}

function transformReviewSkill(skill: JobApi): ReviewSkill {
  if (!skill.name) {
    throw Error('Review skill has no name.');
  }
  return { id: skill.id, name: skill.name };
}
