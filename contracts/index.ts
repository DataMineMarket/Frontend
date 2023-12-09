import { Address } from "wagmi"
import contractAddressesJson from "./contractAddresses.json";

type ContractAddresses = {
  [chainId: number]: {
    [contractName: string]: Address;
  };
};

const contractAddresses: ContractAddresses = contractAddressesJson as unknown as ContractAddresses;

export { default as DataListingFactoryAbi } from "./DataListingFactory.json"
export { default as DataListingAbi } from "./DataListing.json"
export { contractAddresses };
