const { assert, use } = require('chai');
const { default: Web3 } = require('web3');
const truffleAssert = require('truffle-assertions');
const helper = require('./helpers/truffleTestHelpers');

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

    it('XYZ Token Staked Successfully', async () => {
      const stake_amount = 100;
      //Take Approval to transfer inside staking fn
      await XYZtoken.approve(staking.address, stake_amount, { from: a });

      const stakeID = await staking.stake(stake_amount, { from: a });
      truffleAssert.eventEmitted(
        stakeID,
        'Staked',
        (ev) => {
          assert.equal(
            ev.amount,
            stake_amount,
            'Stake amount in event was not correct'
          );
          assert.equal(ev.index, 1, 'Stake index was not correct');
          return true;
        },
        'Stake event should have triggered'
      );

      const staking_contract_balance = await XYZtoken.balanceOf(
        staking.address
      );
      assert.equal(
        staking_contract_balance.toString(),
        (await staking.totalStaking()).toString()
      );

      const a_balance = await XYZtoken.balanceOf(a);
      assert.equal(
        a_balance.toString(),
        Number(5000 - stake_amount).toString()
      );
    });

    it('New stakeholder should have increased index', async () => {
      const stake_amount = 100;
      //Take Approval to transfer inside staking fn
      await XYZtoken.approve(staking.address, stake_amount, { from: b });

      const stakeID = await staking.stake(stake_amount, { from: b });
      truffleAssert.eventEmitted(
        stakeID,
        'Staked',
        (ev) => {
          assert.equal(
            ev.amount,
            stake_amount,
            'Stake amount in event was not correct'
          );
          assert.equal(ev.index, 2, 'Stake index was not correct');
          return true;
        },
        'Stake event should have triggered'
      );

      const staking_contract_balance = await XYZtoken.balanceOf(
        staking.address
      );
      assert.equal(
        staking_contract_balance.toString(),
        (await staking.totalStaking()).toString()
      );

      const b_balance = await XYZtoken.balanceOf(b);
      assert.equal(
        b_balance.toString(),
        Number(1000 - stake_amount).toString()
      );
    });

    it('Cannot stake more than owning', async () => {
      const stake_amount = 6000;
      //Take Approval to transfer inside staking fn
      await XYZtoken.approve(staking.address, stake_amount, { from: a });

      try {
        await staking.stake(stake_amount, { from: a });
      } catch (error) {
        assert.equal(error.reason, 'Cannot stake more than you own');
      }
    });

    it('Cannot withdraw bigger amount than current stake', async () => {
      try {
        await staking.withdrawStake(200, 0, { from: a });
      } catch (error) {
        assert.equal(
          error.reason,
          'Staking: Cannot withdraw more than you have staked',
          'Failed to notice a too big withdrawal from stake'
        );
      }
    });

    it('Withdraw 50 from a stake', async () => {
      let withdraw_amount = 50;
      await ABCtoken.addMinter(staking.address);
      await staking.withdrawStake(withdraw_amount, 0, { from: a });
      let summary = await staking.stakingSummary(a);

      assert.equal(
        summary.total_amount,
        100 - withdraw_amount,
        'The total staking amount should be 150'
      );
      // Iterate all stakes and verify their amount as well.
      let stake_amount = summary.stakes[0].amount;

      assert.equal(
        stake_amount,
        100 - withdraw_amount,
        'Wrong Amount in first stake after withdrawal'
      );
      const staking_contract_balance = await XYZtoken.balanceOf(
        staking.address
      );
      assert.equal(
        staking_contract_balance.toString(),
        (await staking.totalStaking()).toString()
      );

      const a_balance = await XYZtoken.balanceOf(a);
      assert.equal(
        a_balance.toString(),
        Number(5000 - 100 + withdraw_amount).toString()
      );
    });

    it('Remove stake if empty', async () => {
      let withdraw_amount = 50;
      await staking.withdrawStake(withdraw_amount, 0, { from: a });
      let summary = await staking.stakingSummary(a);

      assert.equal(
        summary.stakes[0].user,
        '0x0000000000000000000000000000000000000000',
        'Failed to remove stake when it was empty'
      );
    });
  });
});
