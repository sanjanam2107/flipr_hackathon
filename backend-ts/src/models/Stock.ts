import mongoose, { Document, Schema } from 'mongoose';

export interface IHistoricalData {
  date: Date;
  price: number;
}

export interface IStock extends Document {
  symbol: string;
  name: string;
  price: number;
  industry: string;
  historicalData: IHistoricalData[];
}

const stockSchema = new Schema<IStock>({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  industry: { type: String, required: true },
  historicalData: [{
    date: { type: Date, required: true },
    price: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

export const Stock = mongoose.model<IStock>('Stock', stockSchema); 