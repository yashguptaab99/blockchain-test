// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./XYZToken.sol";
import "./ABCToken.sol";

contract Staking {
    XYZToken public stakingToken;
    ABCToken public rewardToken;

    constructor(ABCToken _rewardToken, XYZToken _stakingToken) public {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }
}
