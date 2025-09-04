import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("WalletModule", (m) => {
  const walletContract = m.contract("Wallet");

  return { walletContract };
});
