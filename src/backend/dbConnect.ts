import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

async function dbConnect() {
  const m = await mongoose.connect(`${MONGODB_URI}`);
  return m;
}

export default dbConnect;
