pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

import "./Libraries/ShoeLibrary.sol";
import "hardhat/console.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Shoe is ERC721Enumerable {
    using Strings for uint256;
    using Strings for uint160;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 mintDeadline = block.timestamp + 3650 days;

    address payable public constant recipient =
        payable(0x54179E1770a780F2F541f23CB21252De12977d3c);

    uint256 public constant limit = 3728;
    uint256 public constant curve = 1005; // price increase 0,5% with each purchase
    uint256 public price = 0.002 ether;

    mapping(uint256 => uint256) public socks_shoes;

    //! Properties types
    string[8] public shoes;

    constructor() ERC721("SocksShoe", "SKSH") {
        shoes = [
            "timberland",
            "slides",
            "geta",
            "nike",
            "nike(brown)",
            "vans",
            "crocs",
            "adidas"
        ];
    }

    function mintItem() public payable returns (uint256) {
        // require(block.timestamp < mintDeadline, "DONE MINTING");
        require(msg.value >= price, "NOT ENOUGH");
        require(_tokenIds.current() <= limit);

        price = (price * curve) / 1000;

        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);

        bytes32 predictableRandom = keccak256(
            abi.encodePacked(id, (block.number - 1), msg.sender, address(this))
        );
        socks_shoes[id] = uint256((uint8(predictableRandom[6])) % 8);

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "could not send");

        return id;
    }

    // Visibility is `public` to enable it being called by other contracts for composition.
    function renderTokenById(uint256 id) public view returns (string memory) {
        uint256 shoe = getPropertiesById(id) + 1;

        string memory render = string(
            abi.encodePacked(
                ShoeLibrary.GetShoeBack(shoe),
                ShoeLibrary.GetShoeFront(shoe)
            )
        );

        return render;
    }

    function renderTokenBackById(uint256 id)
        public
        view
        returns (string memory)
    {
        uint256 shoe = getPropertiesById(id) + 1;

        string memory render = string(
            abi.encodePacked(ShoeLibrary.GetShoeBack(shoe))
        );

        return render;
    }

    function renderTokenFrontById(uint256 id)
        public
        view
        returns (string memory)
    {
        uint256 shoe = getPropertiesById(id) + 1;

        string memory render = string(
            abi.encodePacked(ShoeLibrary.GetShoeFront(shoe))
        );

        return render;
    }

    // function generateSVGofTokenById(uint256 id) internal view returns (string memory) {
    function generateSVGofTokenById(uint256 id)
        internal
        view
        returns (string memory)
    {
        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 880 880">',
                renderTokenById(id),
                "</svg>"
            )
        );
        return svg;
    }

    function getDescription(uint256 id) public view returns (string memory) {
        require(_exists(id), "!exist");
        uint256 shoe = getPropertiesById(id);
        return shoes[shoe];
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "!exist");

        uint256 shoe = getPropertiesById(id);

        string memory name = string(
            abi.encodePacked("Sock Shoe #", id.toString())
        );

        string memory description = string(abi.encodePacked(shoes[shoe]));
        string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '","description":"',
                                description,
                                '","external_url":"https://yourCollectible.com/token/',
                                id.toString(),
                                '","attributes":[{"trait_type":"Shoe","value":"',
                                shoes[shoe],
                                '"}], "owner":"',
                                (uint160(ownerOf(id))).toHexString(20),
                                '","image": "',
                                "data:image/svg+xml;base64,",
                                image,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    // properties of the token of id
    function getPropertiesById(uint256 id) public view returns (uint256 shoe) {
        shoe = socks_shoes[id];
    }
}
