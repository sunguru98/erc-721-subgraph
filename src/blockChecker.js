require('dotenv').config();

const path = require('path');
const ethers = require('ethers');
const EthDater = require('ethereum-block-by-date');

const { promises: fs } = require('fs');

const ERC721_FINALIZED_DATE = new Date('01-24-2018').toISOString();

const RPCS = {
  matic: `https://rpc-mainnet.maticvigil.com/`,
  mumbai: `https://rpc-mumbai.maticvigil.com/`,
  xdai: 'https://rpc.xdaichain.com/',
  optimism: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_ID}`,
  mainnet: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
  rinkeby: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
  kovan: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
};

(async function() {
  for (let rpcKey in RPCS) {
    console.log('GETTING BLOCK NUMBER FOR', rpcKey);
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPCS[rpcKey]);
    const dater = new EthDater(rpcProvider);
    const block = await dater.getDate(ERC721_FINALIZED_DATE);

    await fs.writeFile(
      path.resolve(__dirname, '../config', `${rpcKey}.json`),
      JSON.stringify({ name: rpcKey, startBlock: block.block })
    );
  }
})();
