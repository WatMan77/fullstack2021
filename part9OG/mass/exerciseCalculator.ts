
type RatingDescription = 'Not good...' | 'It was ok' | 'Nicely done! Keep it up!';

interface ExerciseValues {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: RatingDescription,
  target: number,
  average: number
}

const ratingCalculation = (average: number,  target: number): number => {
  if(average >= target){
    return 3;
  } else if(average < target && average >= target * 0.65){
    return 2;
  } else {
    return 1;
  }
};

export const execCalculator = (hours: Array<number>, target: number): ExerciseValues => {

  hours.forEach(x => {
    if(isNaN(Number(x))){
      throw new Error('malformatted parameters');
    }
  });

  const averageHours: number = hours.reduce((a, b) => a + b) / hours.length;
  console.log('average hours', averageHours);

  const descritpions: Array<RatingDescription> = ['Not good...', 'It was ok', 'Nicely done! Keep it up!'];

  const rating = ratingCalculation(averageHours, target);

  const exercisesResult: ExerciseValues = {
    periodLength: hours.length,
    trainingDays: hours.filter(x => x !== 0).length,
    success: averageHours >= target,
    rating: rating,
    ratingDescription: descritpions[rating - 1],
    target: target,
    average: averageHours

  };

  return exercisesResult;
};