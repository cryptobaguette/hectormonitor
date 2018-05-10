import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  id: string;
  telegramUserId: string;
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    telegramUserId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>('User', UserSchema);
