import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

const tokenETHAddress = "0x633C6A715A980f9F1670a3690440294cc34D3e9E";
const bridgeETHAddress = "0xc09e777F1FC98Ca5346cD41ed706999e5f77C44f";

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
    tokenETH = await contract.attach(tokenETHAddress);

    contract = new BridgeEth__factory(owner);
    bridgeETH = await contract.attach(bridgeETHAddress);
    console.log(
      (await tokenETH.balanceOf(owner.address)).toString(),
      "Before Burning"
    );

    const nounce = await owner.getTransactionCount();

    const message = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256"],
      [owner.address, signers[1].address, "1000000000000000000", nounce]
    );

    const arrayFiedresult = ethers.utils.arrayify(message);
    const signature = await owner.signMessage(arrayFiedresult);

    await bridgeETH.burn(
      signers[1].address,
      "1000000000000000000",
      nounce,
      signature
    );

    console.log(
      (await tokenETH.balanceOf(owner.address)).toString(),
      "After Burning"
    );

    console.log("Burn succesfully called");
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
