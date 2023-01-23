const Moralis = require('moralis').default;

/** get all transfers of an NFT */
module.exports.nftTransfers = async (address, tokenId, chain) => {
  const response = await Moralis.EvmApi.nft.getNFTTransfers({
    address,
    tokenId,
    chain,
  });

  return response.toJSON();
}
