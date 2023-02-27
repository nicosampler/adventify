import { models, model, Schema } from "mongoose";

interface IUser {
  id: string;
  privateKey: string;
  mnemonic: string;
  address: string;
}

const UserSchema: Schema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  mnemonic: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
