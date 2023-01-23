const process = require('process');
const Moralis = require('moralis');
const EvmChain = require('@moralisweb3/common-evm-utils');

/** get all transfers of an NFT */
module.exports.nftTransfers = async (address, tokenId, chain = EvmChain.ETHEREUM) => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const response = await Moralis.EvmApi.nft.getNFTTransfers({
    address,
    tokenId,
    chain,
  });

  return response.toJSON();
}
