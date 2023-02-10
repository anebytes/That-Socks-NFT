pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

// Defining Library
library BodyLibrary {
    function getHole() public pure returns (string memory) {
        string memory hole = string(
            abi.encodePacked(
                "<svg",
                '  x="-3"',
                '  y="6"',
                ">",
                "<path",
                ' d="M899.18 373.237C891.045 391.076 835.16 383.06 774.358 355.332C713.555 327.605 670.859 290.666 678.994 272.827C687.129 254.989 743.014 263.005 803.817 290.732C864.619 318.46 907.315 355.398 899.18 373.237Z" fill="black" stroke="black" stroke-width="2"',
                "/>",
                "</svg>"
            )
        );

        return hole;
    }

    function GetRib(string memory color0) public pure returns (string memory) {
        string memory rib = string(
            abi.encodePacked(
                "<svg",
                ' x="13"',
                ' y="13">',
                "<path"
                ' d="M878.5 373c-13,-1 -12,3 -36,-1 -55,-8 -134,-44 -173,-86 -4,-5 -6,-8 -9,-12 -4,4 -33,72 -41,88 -4,7 -2,8 2,13 45,61 123,97 204,93 9,0 9,1 12,-6 2,-5 4,-8 6,-13l23 -51c4,-8 8,-18 12,-25z"'
                ' stroke="black"',
                ' stroke-width="9"',
                " fill=",
                '"',
                color0,
                '"',
                " />",
                " </svg>"
            )
        );
        return rib;
    }

    function GetBody(string memory color0, string memory color1)
        public
        pure
        returns (string memory)
    {
        // Rib
        string memory body = string(
            abi.encodePacked(
                "<path ",
                ' d="M273.068 593.897L491.183 580.768C520.732 578.989 546.883 561.04 559.165 534.106L628.204 382.713C651.95 421.018 729.233 494.728 848.39 483.122L752.337 693.755C714.605 687.722 635.436 702.103 620.608 807.886C487.867 802.124 270.114 790.053 260.421 784.314C350.714 716.462 306.474 629.098 273.068 593.897Z"',
                " fill=",
                '"',
                color0,
                '"',
                ' stroke="black"',
                ' stroke-width="8"',
                "/>"
            )
        );

        // Toe and Heels
        body = string(
            abi.encodePacked(
                body,
                " <path ",
                ' d="M186.3 684.057C193.624 623.65 248.213 598.903 274.592 594.08C307.998 629.28 352.238 716.644 261.945 784.497C249.83 777.323 177.146 759.565 186.3 684.057Z"',
                " fill=",
                '"',
                color1,
                '"',
                "/>",
                "<path",
                ' d="M622.132 808.069C754.873 813.831 753.861 693.937 753.861 693.937C716.13 687.905 636.96 702.286 622.132 808.069Z"',
                " fill=",
                '"',
                color1,
                '"',
                "/>",
                "<path",
                ' d="M186.3 684.057C193.624 623.65 248.213 598.903 274.592 594.08C307.998 629.28 352.238 716.644 261.945 784.497C249.83 777.323 177.146 759.565 186.3 684.057Z"',
                ' stroke="black"',
                ' stroke-width="8"',
                "/>",
                "<path",
                ' d="M622.132 808.069C754.873 813.831 753.861 693.937 753.861 693.937C716.13 687.905 636.96 702.286 622.132 808.069Z"',
                ' stroke="black"',
                ' stroke-width="8"',
                "/>"
            )
        );

        return body;
    }
}
