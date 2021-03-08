import { InjectedConnector } from "@web3-react/injected-connector";
import { PortisConnector } from "@web3-react/portis-connector";

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 80001],
});
const Portis = new PortisConnector({
  dAppId: "3ca5aba8-016e-4e79-bcff-fadc16aa76b1",
  networks: [1, 5, 15001],
});

export { Injected, Portis };
