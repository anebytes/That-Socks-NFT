pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Defining Library
library TokenUriLibrary {
    using Strings for uint256;
    using Strings for uint160;

    function _tokenUri(
        uint256 id,
        string memory desc,
        address owner,
        string memory svg
    ) internal pure returns (string memory) {
        string memory tokenUri = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            string(abi.encodePacked("Sock #", id.toString())),
                            '","description":"',
                            desc,
                            '","external_url":"https://yourCollectible.com/token/',
                            id.toString(),
                            '", "owner":"',
                            (uint160(owner)).toHexString(20),
                            '","image": "',
                            "data:image/svg+xml;base64,",
                            Base64.encode(bytes(svg)),
                            '"}'
                        )
                    )
                )
            )
        );

        return tokenUri;
    }
}
