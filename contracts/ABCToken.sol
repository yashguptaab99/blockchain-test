// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract ABCToken is ERC20, ERC20Detailed, ERC20Mintable {
    constructor() public ERC20Detailed("ABC Token", "ABC", 18) {
        _mint(msg.sender, 0);
    }
}
