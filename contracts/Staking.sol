// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./XYZToken.sol";
import "./ABCToken.sol";

contract Staking {
    XYZToken public stakingToken;
    ABCToken public rewardToken;

    struct Stake {
        address user;
        uint256 amount;
        uint256 since;
        uint256 claimable;
    }

    struct Stakeholder {
        address user;
        Stake[] address_stakes;
    }

    Stakeholder internal stakeholder;
    Stakeholder[] internal stakeholders;

    mapping(address => uint256) internal stakes;

    uint256 public totalStaking;

    struct StakingSummary {
        uint256 total_amount;
        Stake[] stakes;
    }

    event Staked(
        address indexed user,
        uint256 amount,
        uint256 index,
        uint256 timestamp
    );

    constructor(ABCToken _rewardToken, XYZToken _stakingToken) public {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        stakeholders.push(stakeholder);
    }

    function _addStakeholder(address staker) internal returns (uint256) {
        // Push a empty item to the Array to make space for our new stakeholder
        stakeholders.push(stakeholder);
        // Calculate the index of the last item in the array by Len-1
        uint256 userIndex = stakeholders.length - 1;
        // Assign the address to the new index
        stakeholders[userIndex].user = staker;
        // Add index to the stakeHolders
        stakes[staker] = userIndex;
        return userIndex;
    }

    function stake(uint256 _amount) public {
        // Simple check so that user does not stake 0
        require(_amount > 0, "Cannot stake nothing");
        require(
            _amount < stakingToken.balanceOf(msg.sender),
            "Cannot stake more than you own"
        );

        // Mappings in solidity creates all values, but empty, so we can just check the address
        uint256 index = stakes[msg.sender];
        // block.timestamp = timestamp of the current block in seconds since the epoch
        uint256 timestamp = block.timestamp;
        // See if the staker already has a staked index or if its the first time
        if (index == 0) {
            // This stakeholder stakes for the first time
            // We need to add him to the stakeHolders and also map it into the Index of the stakes
            // The index returned will be the index of the stakeholder in the stakeholders array
            index = _addStakeholder(msg.sender);
        }

        // Use the index to push a new Stake
        // push a newly created Stake with the current block timestamp.
        stakeholders[index].address_stakes.push(
            Stake(msg.sender, _amount, timestamp, 0)
        );
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        totalStaking += _amount;
        // Emit an event that the stake has occured
        emit Staked(msg.sender, _amount, index, timestamp);
    }
}
