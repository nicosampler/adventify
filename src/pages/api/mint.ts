// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/backend/dbConnect";
import UserModel from "@/backend/models/user";
import { createWallet } from "@/backend/crypto/createWallet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user: userId, location } = req.body;

  try {
    dbConnect();

    let user = await UserModel.findOne({ id: userId });

    if (!user) {
      const walletInfo = createWallet();

      console.log({ walletInfo });

      user = await UserModel.create({
        id: userId,
        mnemonic: walletInfo.mnemonic,
        privateKey: walletInfo.privateKey,
        address: walletInfo.address,
      });
    }

    console.log(location);

    res.status(200).json({ tokenId: 111, address: user.address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
