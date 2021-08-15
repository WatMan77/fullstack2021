
interface BmiObject {
  height: number,
  weight: number,
  bmi: string
}

export const bmiCalcualtor = (height: number, weight: number): BmiObject => {
  if(height === 0){
    throw new Error('height was 0');
  }
  const heightCm: number = height / 100;
  const value: number = weight / (heightCm * heightCm);
  console.log('Bmi?', value);

  const bmi = () => {

    if(value < 16){
      return 'Underweight (Severe thinness)';
    } else if( 16 <= value && value <= 16.9){
      return 'Underweight (Moderate thinness)';
    } else if(17 <= value && value <= 18.4){
      return 'Underweight (Mild thinness)';
    } else if(18.5 <= value && 24.9){
      return 'Normal (healthy weight)';
    } else if(25 <= value && value <= 29.9){
      return 'Overweight (Pre-obese)';
    } else if(30 <= value && value <= 34.9){
      return 'Obese (Class I)';
    } else if(35 <= value && value <= 39.9){
      'Obese (Class II)';
    } else if(value >= 40){
      return 'Obese (Class III)';
    } else {
      return 'Something went wrong...';
    }
    return 'Something went wrong...';
  };
  const result = bmi();

  return { height, weight, bmi: result};
};