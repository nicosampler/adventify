import { models, model, Schema } from "mongoose";

interface IUser {
  telegramId: number;
  telegramUser: string;
  privateKey: string;
  mnemonic: string;
  address: string;
  // tokens: number[];
}

const UserSchema: Schema = new Schema<IUser>({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
  },
  telegramUser: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
  mnemonic: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  // tokens: {
  //   type: [Number],
  // },
});

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
