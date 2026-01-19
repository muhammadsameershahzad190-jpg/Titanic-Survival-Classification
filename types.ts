
export interface Passenger {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  Cabin: string | null;
  Embarked: string;
}

export interface PredictionResult {
  survived: boolean;
  probability: number;
  reasoning: string;
  keyFeatures: string[];
}

export interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}
