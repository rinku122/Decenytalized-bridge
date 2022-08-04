import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import {
  BridgeBsc,
  BridgeBsc__factory,
  TokenBsc,
  TokenBsc__factory,
} from "../typechain";

let owner: SignerWithAddress;
let signers: SignerWithAddress[];
let contract: any;
let bridgeBSC: BridgeBsc;
let tokenBSC: TokenBsc;

async function main() {
  signers = await ethers.getSigners();
  owner = signers[0];
  console.log("owner", owner.address);

  try {
    contract = new TokenBsc__factory(owner);
    tokenBSC = await contract.deploy();

    console.log("tokenBSC : ", tokenBSC.address);

    await tokenBSC.mint(owner.address, "100000000000000000000");

    console.log("Minted 100 tokenBSC............");

    contract = new BridgeBsc__factory(owner);
    bridgeBSC = await contract.deploy(tokenBSC.address);

    console.log("BSC Bridge : ", bridgeBSC.address);

    await tokenBSC.updateAdmin(bridgeBSC.address);

    console.log("TokenBsc admin changed to bridgeBSC contract................");
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });