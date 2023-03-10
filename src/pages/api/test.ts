// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/backend/dbConnect";
import UserModel from "@/backend/models/user";
// import LocationModel from "@/backend/models/location";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log({ body: req.body });
  const { telegramId, telegramUser, location } = req.body;

  try {
    const mongoose = await dbConnect();
    console.log(mongoose.modelNames);
    console.log("finding user");
    // get or create user
    let userDB = await UserModel.findOne({ telegramId }).exec();

    res.status(200).json(userDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
