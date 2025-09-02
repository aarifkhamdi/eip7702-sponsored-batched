import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TestCoinModule = buildModule("TestCoinModule", (m) => {
  const name = m.getParameter("name", "Test Coin");
  const symbol = m.getParameter("symbol", "TC");
  const initialSupply = m.getParameter(
    "initialSupply",
    "1000000000000000000000000"
  );
  const owner = m.getParameter("owner", m.getAccount(0));

  const testCoinContract = m.contract("TestCoin", [
    name,
    symbol,
    initialSupply,
    owner,
  ]);

  return { testCoinContract };
});

export default TestCoinModule;
