var express = require('express');
var router = express.Router();
const moralis = require('../services/moralis');
// const cors = require('cors');

/** cors option */
// let NFTCorsOptions = {
//   origin: 'http://127.0.0.1',
//   optionsSuccessStatus: 200
// };
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true
};

/** get all transfers of an NFT */
router.get('/nft/transfers', async function(req, res) {
  try {
    /** access the provided query parameters */
    const address = req.query.address;
    const tokenId = req.query.tokenId;
    const chain = req.query.chain;

    /** get transfers history */
    const data = await moralis.nftTransfers(address, tokenId, chain);

    /** response */
    res.set(headers).status(200).json(data);
  } catch (err) {
    res.set(headers).status(err.status || 500).json({ message: err.message, stack: err.stack });
  }
});

/** get all NFTs owned by an address */
router.get('/address/nfts', async function(req, res) {
  try {
    /** access the provided query parameters */
    const address = req.query.address;
    const chain = req.query.chain;

    /** get transfers history */
    const data = await moralis.getAllNFTByAddress(address, chain);

    /** response */
    res.set(headers).status(200).json(data);
  } catch (err) {
    res.set(headers).status(err.status || 500).json({ message: err.message, stack: err.stack });
  }
});

/** aet all transfers of an NFT collection */
router.get('/collection/nfts/transfers', async function(req, res) {
  try {
    /** access the provided query parameters */
    const address = req.query.address;
    const chain = req.query.chain;

    /** get transfers history */
    const data = await moralis.getAllNFTCollectionTransfers(address, chain);

    /** response */
    res.set(headers).status(200).json(data);
  } catch (err) {
    res.set(headers).status(err.status || 500).json({ message: err.message, stack: err.stack });
  }
});

module.exports = router;
