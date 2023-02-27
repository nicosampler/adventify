import { ethers } from "ethers";

export function createWallet() {
  const wallet = ethers.Wallet.createRandom();

  return {
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
    address: wallet.address,
  };
}
