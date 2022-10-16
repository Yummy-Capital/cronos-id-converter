# Cronos Identity transfer ownership issue

| Account | Address                                                                                       |
| ------- | --------------------------------------------------------------------------------------------- |
| Alice   | [0xE43e9b...472000](https://cronoscan.com/address/0xE43e9bDec33AC9b1DD5d3509fB6AFED1C1472000) |
| Bob     | [0x93e788...E2fFb4](https://cronoscan.com/address/0x93e7884138FB6f7EFed4f26609169B5d6FE2fFb4) |

1. Alice [mints](https://cronoscan.com/tx/0xbbc495961ba044118b84c4c6c100eff5c795c7d0e80dc6c39405b064fe32ae3d) `web3boss.cro`
2. Bob [buys](https://cronoscan.com/tx/0xbca90f74b42cf6c613ab0b5c7e95f22073c50844fce22cc438f6a486076c5171) `web3boss.cro` on [Minted Network](https://minted.network)

Now, based on [cronos id converter](https://cronos-id-converter-ntwx6.ondigitalocean.app), we can see that Alice still owns `web3boss.cro`! Is it really? At least Alice can [make](https://cronoscan.com/tx/0x4b2eb17398d4cd2a9abd2b6715a0a4fcf4a9164fa2afae10ce730ca83cbe6cd4) changes for this domain 🤯 At the same time, Alice cannot transfer the domain to anyone else, because the domain is actually in Bob's wallet.

###### We have checked several recent sales, as well as the very first one, and there is a similar problem everywhere.

Why then does [Minted Network](https://minted.network) display the correct owner? Most likely they use their own API, backed by their own indexer, which take into account transfer events.
