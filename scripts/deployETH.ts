import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import {
  BridgeEth,
  BridgeEth__factory,
  TokenEth,
  TokenEth__factory,
} from "../typechain";

let owner: SignerWithAddress;
let signers: SignerWithAddress[];
let contract: any;
let bridgeETH: BridgeEth;
let tokenETH: TokenEth;

async function main() {
  signers = await ethers.getSigners();
  owner = signers[0];
  console.log("owner", owner.address);

  try {
    contract = new TokenEth__factory(owner);
    tokenETH = await contract.deploy();

    console.log("tokenETH : ", tokenETH.address);

    await tokenETH.mint(owner.address, "50000000000000000000");

    console.log("Minted 50 tokenETH............");

    contract = new BridgeEth__factory(owner);
    bridgeETH = await contract.deploy(tokenETH.address);

    console.log("ETH Bridge : ", bridgeETH.address);

    await tokenETH.updateAdmin(bridgeETH.address);

    console.log("TokenETH admin changed to bridgeETH contract................");
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
