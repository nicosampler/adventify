import { ethers } from "ethers";
import { Adventify, Adventify__factory } from "types/generated/typechain";
import abi from "@/backend/crypto/Adventify.json";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
const adventify = Adventify__factory.connect(
  process.env.ADVENTIFY as string,
  wallet
);

export async function createLocationToken(
  locationId: string,
  imageUrl: string
) {
  const txRecipient = await adventify.createToken(locationId, imageUrl);
  await txRecipient.wait();
}

export async function getTokenIdFromLocationId(locationId: string) {
  const res = await adventify.locationToTokenId(locationId);
  return Number(res.toString());
}

export async function mintAsset(to: string, tokenId: number) {
  const txRecipient = await adventify.mint(to, tokenId, "0x");
  await txRecipient.wait();
}
