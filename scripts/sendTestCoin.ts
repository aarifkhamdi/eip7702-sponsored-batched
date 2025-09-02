import { network } from "hardhat";
import TestCoinModule from "../ignition/modules/TestCoin.js";

const { viem, ignition } = await network.connect();
const { testCoinContract } = await ignition.deploy(TestCoinModule);

const [senderWallet, ...wallets] = await viem.getWalletClients();
const publicClient = await viem.getPublicClient();

let nonce = await publicClient.getTransactionCount({
  address: senderWallet.account.address,
});

for (const wallet of wallets.slice(0, 5)) {
  const hash = await testCoinContract.write.transfer(
    [wallet.account.address, 100n * 10n ** 18n],
    { nonce }
  );
  nonce++;
  console.log(
    `Sent 100 TC from ${senderWallet.account.address} to ${wallet.account.address}, tx hash: ${hash}`
  );
}
