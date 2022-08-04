const Web3 = require("web3");
const dotenv = require("dotenv");
const BridgeEth = require("./artifacts/contracts/BridgeEth.sol/BridgeEth.json");

const BridgeBsc = require("./artifacts/contracts/BridgeBsc.sol/BridgeBsc.json");

dotenv.config();

const web3Eth = new Web3(process.env.RINKYBY_WS);
const web3Bsc = new Web3(process.env.BINANCE_RPC);
const { address: admin } = web3Bsc.eth.accounts.wallet.add(
  process.env.PRIVATE_KEY
);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  process.env.ETH_BRIDGE_ADDRESS
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  process.env.BSC_BRIDGE_ADDRESS
);
bridgeEth.events
  .Transfer({ fromBlock: 0, step: 0 })
  .on("data", async (event) => {
    console.log("Transaction found......");
    const { from, to, amount, date, nonce, signature } = event.returnValues;

    // console.log(from, to, amount, date, nonce, signature);

    // console.log(bridgeBsc.methods);

    const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
    const [gasPrice, gasCost] = await Promise.all([
      web3Bsc.eth.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeBsc.options.address,
      data,
      gas: gasCost,
      gasPrice,
    };
    const receipt = await web3Bsc.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
  });
