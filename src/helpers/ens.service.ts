/* eslint-disable no-empty */
import { ethers } from "ethers";

export class EnsService {
  private readonly ensAddress = "0x7F4C61116729d5b27E5f180062Fdfbf32E9283E5";
  private readonly provider = new ethers.providers.JsonRpcProvider(
    "https://evm.cronos.org"
  );

  async getResolver(node: string) {
    try {
      // keccak256("resolver(bytes32)")
      const data = await this.provider.call({
        to: this.ensAddress,
        data: "0x0178b8bf" + ethers.utils.namehash(node).substring(2),
      });

      return this.provider.formatter.callAddress(data);
    } catch {}
  }

  async lookupAddress(address: string) {
    address = this.provider.formatter.address(address);
    const node = address.substring(2).toLowerCase() + ".addr.reverse";
    const resolverAddr = await this.getResolver(node);

    if (!resolverAddr) {
      return;
    }

    try {
      // keccak256("name(bytes32)")
      const data = await this.provider.call({
        to: resolverAddr,
        data: "0x691f3431" + ethers.utils.namehash(node).substring(2),
      });

      if (data === "0x") {
        return;
      }

      const offset = ethers.BigNumber.from(
        ethers.utils.hexDataSlice(data, 0, 32)
      ).toNumber();

      const length = ethers.BigNumber.from(
        ethers.utils.hexDataSlice(data, offset, offset + 32)
      ).toNumber();

      const name = ethers.utils.toUtf8String(
        ethers.utils.hexDataSlice(data, offset + 32, offset + 32 + length)
      );

      const addr = await this.resolveName(name);

      if (addr != address) {
        return;
      }

      return name;
    } catch {}
  }

  async resolveName(name: string) {
    const resolverAddr = await this.getResolver(name);

    if (!resolverAddr) {
      return;
    }

    try {
      // keccak256("addr(bytes32)")
      const data = await this.provider.call({
        to: resolverAddr,
        data: "0x3b3b57de" + ethers.utils.namehash(name).substring(2),
      });

      if (data === "0x") {
        return;
      }

      return this.provider.formatter.callAddress(data);
    } catch (e) {}
  }

  async resolveOwner(name: string) {
    try {
      // keccak256("owner(bytes32)")
      const data = await this.provider.call({
        to: this.ensAddress,
        data: "0x02571be3" + ethers.utils.namehash(name).substring(2),
      });

      if (data === "0x") {
        return;
      }

      return this.provider.formatter.callAddress(data);
    } catch (e) {}
  }
}
