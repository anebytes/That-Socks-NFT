pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// Defining Library
library ToUint256 {
    function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
        if (_bytes.length < 32) revert();
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
    }
}
