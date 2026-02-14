import { Post } from "@/types/post";

interface ScoringFactors {
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  viewCount: number;
  postAgeHours: number;
  isFollowing: boolean;
  isMutualFollow: boolean;
  hasInteractedWithAuthor: boolean;
  hasMatchingTags: boolean;
  contentTypePreference: number;
}

export function calculateRecommendationScore(factors: ScoringFactors): number {
  const engagementRate =
    (factors.likesCount * 1.0 +
      factors.commentsCount * 3.0 +
      factors.savesCount * 4.0 +
      factors.sharesCount * 5.0) /
    Math.max(factors.viewCount, 1);

  const timeDecay = Math.pow(0.5, factors.postAgeHours / 12);

  let relationshipBoost = 0;
  if (factors.isMutualFollow) relationshipBoost = 0.4;
  else if (factors.isFollowing) relationshipBoost = 0.25;
  if (factors.hasInteractedWithAuthor) relationshipBoost += 0.2;

  const contentRelevance =
    (factors.hasMatchingTags ? 0.15 : 0) + factors.contentTypePreference * 0.1;

  const score =
    engagementRate * 0.35 +
    timeDecay * 0.25 +
    relationshipBoost * 0.25 +
    contentRelevance * 0.15;

  return Math.round(score * 10000) / 10000;
}

export function buildFeedOrder(
  followedPosts: Post[],
  recommendedPosts: Post[]
): Post[] {
  const scoredFollowed = [...followedPosts].sort(
    (a, b) => b.engagementScore - a.engagementScore
  );
  const scoredRecommended = [...recommendedPosts].sort(
    (a, b) => b.engagementScore - a.engagementScore
  );

  const result: Post[] = [];
  let fIdx = 0;
  let rIdx = 0;
  let count = 0;

  while (fIdx < scoredFollowed.length || rIdx < scoredRecommended.length) {
    if (
      fIdx < scoredFollowed.length &&
      (count % 4 !== 3 || rIdx >= scoredRecommended.length)
    ) {
      result.push(scoredFollowed[fIdx]);
      fIdx++;
    } else if (rIdx < scoredRecommended.length) {
      result.push(scoredRecommended[rIdx]);
      rIdx++;
    }
    count++;
  }

  return result;
}
