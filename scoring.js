import { FLAVORS } from '../data/flavors';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

/**
 * Calculates the best matching ice cream flavor based on user's answers
 * @param {Record<string, string>} answers - mapping questionId to optionId
 * @returns {{ flavor: object, scoreMap: Record<string, number>, topReason: string }}
 */
export function calculateRecommendation(answers) {
  const scores = {};
  FLAVORS.forEach(f => {
    scores[f.id] = 0;
  });

  // Calculate scores based on user choices
  QUIZ_QUESTIONS.forEach(question => {
    const selectedOptionId = answers[question.id];
    if (selectedOptionId) {
      const option = question.options.find(opt => opt.id === selectedOptionId);
      if (option && option.scores) {
        Object.entries(option.scores).forEach(([flavorId, points]) => {
          if (scores[flavorId] !== undefined) {
            scores[flavorId] += points;
          }
        });
      }
    }
  });

  // Find flavor with highest score
  let bestFlavorId = FLAVORS[0].id;
  let highestScore = -1;

  Object.entries(scores).forEach(([flavorId, total]) => {
    if (total > highestScore) {
      highestScore = total;
      bestFlavorId = flavorId;
    }
  });

  const matchedFlavor = FLAVORS.find(f => f.id === bestFlavorId) || FLAVORS[0];

  return {
    flavor: matchedFlavor,
    scoreMap: scores,
    moodAnswer: answers.mood,
    tasteAnswer: answers.taste,
    textureAnswer: answers.texture,
  };
}
