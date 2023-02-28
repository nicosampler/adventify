// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NodeGeocoder from "node-geocoder";

import dbConnect from "@/backend/dbConnect";
import UserModel from "@/backend/models/user";
import { createWallet } from "@/backend/crypto/createWallet";
import LocationModel from "@/backend/models/location";
import { generateImage } from "@/backend/ai/image";
import {
  createLocationToken,
  getTokenIdFromLocationId,
  mintAsset,
} from "@/backend/crypto/adventify";

const options = {
  provider: "google",
  // fetch: axios,
  apiKey: process.env.GOOGLE_KEY as string,
  formatter: "json",
} as NodeGeocoder.GoogleOptions;

const geocoder = NodeGeocoder(options);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log({ body: req.body });
  const { telegramId, telegramUser, location } = req.body;

  try {
    dbConnect();
    console.log("finding user");
    // get or create user
    let userDB = await UserModel.findOne({ telegramId }).exec();
    if (!userDB) {
      console.log("User not found, creating it...");
      const walletInfo = createWallet();
      userDB = await UserModel.create({
        telegramId,
        telegramUser,
        mnemonic: walletInfo.mnemonic,
        privateKey: walletInfo.privateKey,
        address: walletInfo.address,
      });
    }
    console.log(`User ${userDB.telegramId}:${userDB.telegramUser} created`);

    // find city or create city
    const geoCoderRes = (
      await geocoder.reverse({
        lat: location.latitude,
        lon: location.longitude,
      })
    )[0];

    console.log(JSON.stringify(geoCoderRes));
    const city = geoCoderRes.country;
    const country =
      geoCoderRes.city || (geoCoderRes as any).extra?.neighborhood;
    if (!country || !city) {
      throw {
        code: "NO_PLACE",
        message: "It was not possible to find a place based on coordinates",
      };
    }

    const locationId = `${country}-${city}`.toLowerCase();
    console.log({ locationId });

    // find city & country
    let locationDB = await LocationModel.findOne({ id: locationId }).exec();
    let tokenId = null;
    if (!locationDB) {
      console.log("Location not found, creating it...");

      // creates an image with AI
      const imageUrl = await generateImage(country, city);
      // const imageUrl =
      //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-DJ4utsVJC52kwadTMCRRuMuQ/user-zesqmFNCqDfZr29SC3KVapJf/img-jXefnCgCpyt0DObFlJ3ezX1I.png?st=2023-02-27T23%3A13%3A35Z&se=2023-02-28T01%3A13%3A35Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-02-27T21%3A41%3A22Z&ske=2023-02-28T21%3A41%3A22Z&sks=b&skv=2021-08-06&sig=yd7R7fMb/6fq5fVqLvIZF3iKpZUrhfn4MrEPGUwYsho%3D";

      if (!imageUrl) {
        throw {
          code: "NO_IMAGE",
          message: "It was not possible to generate the image",
        };
      }

      await createLocationToken(locationId, imageUrl);
      tokenId = await getTokenIdFromLocationId(locationId);
      locationDB = await LocationModel.create({
        id: locationId,
        city,
        country,
        tokenId,
        url: imageUrl,
      });
    } else {
      tokenId = await getTokenIdFromLocationId(locationId);
    }
    console.log(`Location with tokenId ${tokenId}`);

    console.log(`Minting asset...`);
    await mintAsset(userDB.address, tokenId);
    console.log(`Asset minted...`);

    res.status(200).json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
