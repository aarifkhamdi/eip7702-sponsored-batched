import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import { parseEther } from "viem";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  ignition: {
    strategyConfig: {
      create2: {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000001",
      },
    },
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    optimism: {
      type: "http",
      chainType: "op",
      chainId: 10,
      url: "https://optimism-rpc.publicnode.com",
      accounts: {
        mnemonic: configVariable("TEST_MNEMONIC"),
      },
    },
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};

export default config;
