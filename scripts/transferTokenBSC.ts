// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import { ethers } from "hardhat";

// const tokenBscAddress = "0x22e1E5342AC6a7157D77554DFBe041Aa0dfd91F9";
// const bridgeBscAddress = "0xde3507e28b608b771D87A065e39916a27C889119";

// import {
//   BridgeBsc,
//   BridgeBsc__factory,
//   TokenBsc,
//   TokenBsc__factory,
// } from "../typechain";

// let owner: SignerWithAddress;
// let signers: SignerWithAddress[];
// let contract: any;
// let bridgeBSC: BridgeBsc;
// let tokenBSC: TokenBsc;

// async function main() {
//   signers = await ethers.getSigners();
//   owner = signers[0];
//   console.log("owner", owner.address);

//   try {
//     contract = new TokenBsc__factory(owner);
//     tokenBSC = await contract.attach(tokenBscAddress);

//     contract = new BridgeBsc__factory(owner);
//     bridgeBSC = await contract.attach(bridgeBscAddress);
//     console.log(
//       (await tokenBSC.balanceOf(owner.address)).toString(),
//       "Before Burning"
//     );

//     await bridgeBSC.burn(signers[1].address, "2000000000000000000");

//     console.log(
//       (await tokenBSC.balanceOf(owner.address)).toString(),
//       "After Burning"
//     );

//     console.log("Burn succesfully called");
//   } catch (error) {
//     console.log(error);
//   }
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
