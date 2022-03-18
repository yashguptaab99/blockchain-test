const { assert, use } = require('chai');
const { default: Web3 } = require('web3');

const XYZToken = artifacts.require('XYZToken');
const ABCToken = artifacts.require('ABCToken');
const Staking = artifacts.require('Staking');

require('chai').use(require('chai-as-promised')).should();

contract('Staking', ([creator, a, b, c, d, e]) => {
  let XYZtoken, ABCtoken, staking;

  before(async () => {
    //Load contracts
    ABCtoken = await ABCToken.new();
    XYZtoken = await XYZToken.new();

    await XYZtoken.mint(a, 5000);
    await XYZtoken.mint(b, 1000);
    await XYZtoken.mint(c, 3000);
    await XYZtoken.mint(d, 900);
    await XYZtoken.mint(e, 100);

    staking = await Staking.new(ABCtoken.address, XYZtoken.address);
  });

  describe('Staking deployment', async () => {
    it('Staking Token and Reward Token is set', async () => {
      const stakingToken = await staking.stakingToken();
      assert.equal(stakingToken, XYZtoken.address);

      const rewardToken = await staking.rewardToken();
      assert.equal(rewardToken, ABCtoken.address);
    });
  });
});
