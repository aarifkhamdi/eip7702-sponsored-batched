import { network } from "hardhat";
import { createWalletClient, encodeFunctionData, erc20Abi, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import WalletModule from "../ignition/modules/Wallet.js";
import BatcherModule from "../ignition/modules/Batcher.js";
import TestCoinModule from "../ignition/modules/TestCoin.js";

const { viem, ignition, networkConfig } = await network.connect();

const [senderWallet, ...wallets] = await viem.getWalletClients();
const testWallets = wallets.slice(0, 5);
const receiverWallet = wallets[5];

let url;
if (networkConfig.type == "http") {
  url = await networkConfig.url.getUrl();
} else {
  throw new Error();
}

let mnemonic;
if (
  typeof networkConfig.accounts === "object" &&
  networkConfig.accounts &&
  "mnemonic" in networkConfig.accounts
) {
  mnemonic = await networkConfig.accounts.mnemonic.get();
} else {
  throw new Error("Invalid accounts config");
}

const realTestWallets = await Promise.all(
  testWallets.map(async (w, i) => {
    const realWallet = createWalletClient({
      account: mnemonicToAccount(mnemonic, { addressIndex: i + 1 }),
      chain: w.chain,
      transport: http(url),
    });
    console.log("Real wallet address:", realWallet.account.address);
    if (
      realWallet.account.address.toLowerCase() !==
      w.account.address.toLowerCase()
    ) {
      throw new Error("Wallet address mismatch");
    }
    return realWallet;
  })
);

const { walletContract } = await ignition.deploy(WalletModule);
const { testCoinContract } = await ignition.deploy(TestCoinModule);
const { batcherContract } = await ignition.deploy(BatcherModule);

const auths = await Promise.all(
  realTestWallets.map((wc) =>
    wc.signAuthorization({
      contractAddress: walletContract.address,
    })
  )
);

const calls = realTestWallets.map((w) => {
  const transferData = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [receiverWallet.account.address, 5n],
  });
  const walletCallData = encodeFunctionData({
    abi: walletContract.abi,
    functionName: "call",
    args: [testCoinContract.address, 0n, transferData],
  });
  return {
    to: w.account.address,
    value: 0n,
    data: walletCallData,
  };
});

const data = encodeFunctionData({
  abi: batcherContract.abi,
  functionName: "batch",
  args: [calls],
});

const realSenderWallet = createWalletClient({
  account: mnemonicToAccount(mnemonic, { addressIndex: 0 }),
  chain: senderWallet.chain,
  transport: http(url),
});

const tx = await realSenderWallet.sendTransaction({
  to: batcherContract.address,
  data,
  authorizationList: auths,
  type: "eip7702",
});

console.log("Batch tx hash:", tx);
