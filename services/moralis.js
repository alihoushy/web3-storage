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

/** get all NFTs owned by an address */
module.exports.getAllNFTByAddress = async (address, chain) => {
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain,
  });

  return response.toJSON();
}

/** aet all transfers of an NFT collection */
module.exports.getAllNFTCollectionTransfers = async (address, chain) => {
  const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
    address,
    chain,
  });

  return response.toJSON();
}
