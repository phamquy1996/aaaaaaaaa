import { UserRecommendationApi } from 'api-typings/users/users';
import { UserRecommend } from './users-recommend.model';

export function transformUsersRecommend(
  usersRecommendApi: UserRecommendationApi,
): UserRecommend {
  return {
    id: usersRecommendApi.recommended_user_id,
    comment: usersRecommendApi.comment,
    date: usersRecommendApi.recommended_date * 1000,
    recommendedByUserId: usersRecommendApi.recommended_by_user_id,
    recommendedUserId: usersRecommendApi.recommended_user_id,
  };
}
