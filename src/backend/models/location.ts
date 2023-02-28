import { models, model, Schema } from "mongoose";

interface ILocation {
  id: string;
  city: string;
  country: string;
  tokenId: number;
  url: string;
}

const LocationSchema: Schema = new Schema<ILocation>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  tokenId: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const LocationModel =
  models.Location || model<ILocation>("Location", LocationSchema);

export default LocationModel;
