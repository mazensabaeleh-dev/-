import {
  AnswerValue,
  DimensionScore,
  HollandAssessmentResult,
  HollandDimensionCode,
  StudentInfo,
} from '../types';
import {
  calculateHexagonDistance,
  HOLLAND_DIMENSIONS,
  HOLLAND_QUESTIONS,
} from '../data/hollandData';

export function calculateHollandResult(
  answers: Record<number, AnswerValue>,
  studentInfo: StudentInfo
): HollandAssessmentResult {
  const dimensionCodes: HollandDimensionCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];

  const rawScores: DimensionScore[] = dimensionCodes.map((code) => {
    const dimInfo = HOLLAND_DIMENSIONS[code];
    const items = dimInfo.itemNumbers;

    const likedItems: { id: number; profession: string }[] = [];
    let score = 0;

    items.forEach((itemId) => {
      if (answers[itemId] === 'like') {
        score += 1;
        const q = HOLLAND_QUESTIONS.find((item) => item.id === itemId);
        if (q) {
          likedItems.push({ id: q.id, profession: q.profession });
        }
      }
    });

    const percentage = Math.round((score / 14) * 100);

    return {
      code,
      info: dimInfo,
      score,
      maxScore: 14,
      percentage,
      rank: 0,
      likedItems,
    };
  });

  // Sort descending by score. If equal score, keep predictable order
  rawScores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-breaker: keep RIASEC canonical order
    return dimensionCodes.indexOf(a.code) - dimensionCodes.indexOf(b.code);
  });

  // Assign ranks
  rawScores.forEach((item, index) => {
    item.rank = index + 1;
  });

  const dominantDimension = rawScores[0];
  const secondaryDimension = rawScores[1];
  const tertiaryDimension = rawScores[2];

  // 3-letter Holland Code
  const hollandCode = `${dominantDimension.code}${secondaryDimension?.code || ''}${tertiaryDimension?.code || ''}`;

  const totalLiked = Object.values(answers).filter((v) => v === 'like').length;

  // Differentiation: maxScore - minScore
  const minScore = rawScores[rawScores.length - 1].score;
  const diffSpread = dominantDimension.score - minScore;
  let differentiationLevel: 'high' | 'medium' | 'low' = 'medium';
  if (diffSpread >= 7) {
    differentiationLevel = 'high';
  } else if (diffSpread <= 3) {
    differentiationLevel = 'low';
  }

  // Hexagon consistency between dominant and secondary
  const hexDist = calculateHexagonDistance(dominantDimension.code, secondaryDimension.code);
  let consistencyScore: 'high' | 'medium' | 'low' = 'medium';
  if (hexDist === 1) consistencyScore = 'high';
  else if (hexDist === 3) consistencyScore = 'low';

  // Construct summary text
  const studentDisplayName = studentInfo.name?.trim() || 'عزيزي الطالب / عزيزتي الطالبة';
  const summaryText = `${studentDisplayName}، نتيجتك في مقياس هولاند تشير إلى أن نمطك المهني الغالب هو "${dominantDimension.info.arabicName}" برمز (${dominantDimension.code}) بنتيجة ${dominantDimension.score} من 14، يليه نمط "${secondaryDimension.info.arabicName}" برمز (${secondaryDimension.code})، ليشكل كود هولاند الثلاثي الخاص بك: (${hollandCode}). هذا الترتيب يبرز قدراتك وميولك الطبيعية ويوجهك نحو البيئات والتخصصات التي تحقق فيها أعلى مستويات الرضا والتميز الأكاديمي والمهني.`;

  return {
    studentInfo,
    scores: rawScores,
    dominantDimension,
    secondaryDimension,
    tertiaryDimension,
    hollandCode,
    totalLiked,
    differentiationLevel,
    consistencyScore,
    summaryText,
    completedAt: new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}
