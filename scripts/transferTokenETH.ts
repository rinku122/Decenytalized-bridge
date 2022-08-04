import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

const tokenETHAddress = "0x8d23B5C601C4A7606Af0BE7Ff7832A02A41D2Df5";
const bridgeETHAddress = "0x6A60B240c6C9774589Ff2e8c7E58F665709A8D90";

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
