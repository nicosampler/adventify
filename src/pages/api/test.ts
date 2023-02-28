// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/backend/dbConnect";
// import LocationModel from "@/backend/models/location";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    dbConnect();

    // get or create user
    // let userDB = await UserModel.findOne({ telegramId: 1150267128 }).exec();

    // let locationDB = await LocationModel.findOne({
    //   id: "portugal-lisboa",
    // }).exec();

    res.status(200).json({ locationDB: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
