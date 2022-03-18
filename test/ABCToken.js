const { assert, use } = require('chai');
const { default: Web3 } = require('web3');
const truffleAssert = require('truffle-assertions');

const ABCToken = artifacts.require('ABCToken');

require('chai').use(require('chai-as-promised')).should();

contract('ABCToken', ([creator, a, b, c, d, e]) => {
  let ABCtoken;

  before(async () => {
    //Load contracts
    ABCtoken = await ABCToken.new();
  });

  describe('ABCToken deployment', async () => {
    it('Should not mint more than mint limit', async () => {
      try {
        await ABCtoken.mint(a, 400000);
      } catch (error) {
        assert.equal(error.reason, 'Cannot Mint more than limit.');
      }
    });
  });
});
