import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BatcherModule", (m) => {
  const batcherContract = m.contract("Batcher");

  return { batcherContract };
});
