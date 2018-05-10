import * as mongoose from 'mongoose';
import { Coins, Pools } from '../types/types';

export interface Address extends mongoose.Document {
  id: string;
  userId: string;
  address: string;
  coin: Coins;
  pool: Pools;
  lastPayoutId?: string;
}

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },
    pool: {
      type: String,
      required: true,
    },
    lastPayoutId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const AddressModel = mongoose.model<Address>('Address', AddressSchema);
