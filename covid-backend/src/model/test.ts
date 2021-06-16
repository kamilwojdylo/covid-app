import mongoose from "mongoose";

export interface ILocation {
  lat: number;
  lng: number;
};

export type Outcome = 'positive' | 'negative';
export type Country = 'poland' | 'usa' | 'russia';
export type Timestamp = number;

export interface ITest {
  patientName: string;
  patientAge: number;
  location: ILocation;
  testDate: Timestamp;
  outcome: Outcome;
  country: Country;
}

export interface ITestDocument extends ITest, mongoose.Document {}

export const TestSchema = new mongoose.Schema({
  patientName: {type: String, required: true},
  patientAge: {type: Number, required: true},
  location: {lat: {type: Number, required: true}, lng: {type: Number, required: true}},
  testDate: {type: Number, required: true},
  outcome: {type: String, required: true},
  country: {type: String, required: true}
});

const Test = mongoose.model<ITestDocument>("Test", TestSchema);
export default Test;
