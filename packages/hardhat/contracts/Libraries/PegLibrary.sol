pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

// Defining Library
library PegLibrary {
    function GetPegBack(string memory color)
        public
        pure
        returns (string memory)
    {
        string memory pegBack = string(
            abi.encodePacked(
                ' <svg x="30"  y="-2">',
                '<path d="M754.141 307.338L777.302 140.147L851.22 136.672L797.827 320.057L754.141 307.338Z" ',
                " fill=",
                '"',
                color,
                '"',
                ' stroke="black" stroke-width="8"/></svg>'
            )
        );

        return pegBack;
    }

    function GetPegFront(string memory color)
        public
        pure
        returns (string memory)
    {
        string memory pegFront = string(
            abi.encodePacked(
                '<path d="M-5.5 155C220.667 223.833 754.3 328.9 1079.5 198.5" stroke="black" stroke-width="8"/><svg x="30"  y="-2">',
                '<path d="M739.493 308.436L740.085 139.649L812.875 126.319L784.488 315.198L739.493 308.436Z"',
                 ' fill=',
                '"',
                color,
                '"',
                ' stroke="black" stroke-width="8"/></svg>'
            )
        );
        return pegFront;
    }
}
