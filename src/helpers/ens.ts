// https://github.com/kentimsit/cronosid-domains-tutorial
import { ethers } from "ethers";

const CRONOSID_REGISTRY_CONTRACT_ADDRSS =
  "0x7F4C61116729d5b27E5f180062Fdfbf32E9283E5";

const CRONOSID_REGISTRY_CONTRACT_ABI = [
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
    ],
    name: "resolver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
    ],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const CRONOSID_RESOLVER_CONTRACT_ABI = [
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const forwardResolution = async (
  domain: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {
  const node = ethers.utils.namehash(domain);

  if (
    node ===
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    throw new Error("Owner not found");
  }

  const contract = new ethers.Contract(
    CRONOSID_REGISTRY_CONTRACT_ADDRSS,
    CRONOSID_REGISTRY_CONTRACT_ABI,
    provider
  );

  const owner = await contract.owner(node);
  return `0x${owner.substring(2).toUpperCase()}`;
};

export const reverseResolution = async (
  address: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const derived_domain = address.toLowerCase().substring(2) + ".addr.reverse";
  const derived_node = ethers.utils.namehash(derived_domain);

  const contract = new ethers.Contract(
    CRONOSID_REGISTRY_CONTRACT_ADDRSS,
    CRONOSID_REGISTRY_CONTRACT_ABI,
    provider
  );

  const resolverContractAddress = await contract.resolver(derived_node);

  const ethersResolverContract = new ethers.Contract(
    resolverContractAddress,
    CRONOSID_RESOLVER_CONTRACT_ABI,
    provider
  );

  return <string>ethersResolverContract.name(derived_node);
};
