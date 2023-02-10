pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "base64-sol/base64.sol";

import "./Libraries/BodyLibrary.sol";
import "hardhat/console.sol";
import "./Libraries/NFTContract.sol";
import "./Libraries/ToUint256.sol";
import "./Libraries/TokenUriLibrary.sol";
import "./Libraries/RandomNumber.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract ThatSocks is ERC721Enumerable, IERC721Receiver {
    struct upgradeIds {
        uint256 backgroundId;
        uint256 logoId;
        uint256 patternId;
        uint256 pegId;
        uint256 legId;
        uint256 shoeId;
    }

    struct NftContracts {
        address backgroundContract;
        address logoContract;
        address patternContract;
        address pegContract;
        address legContract;
        address shoeContract;
    }

    uint256 _tokenIds;

    mapping(address => mapping(uint256 => uint256)) nftById;
    mapping(uint256 => mapping(uint8 => uint8)) socksColors;

    mapping(uint8 => NftContracts) nftContracts;

    address payable constant recipient =
        payable(0x54179E1770a780F2F541f23CB21252De12977d3c);

    uint256 public constant limit = 3728;
    uint256 public price = 0.002 ether;
    uint256 private constant curve = 1002; // price increase 0,5% with each purchase

    mapping(uint256 => upgradeIds) public socksUpgrades;
    string[12] colors;

    constructor(
        address _background,
        address _logo,
        address _pattern,
        address _peg,
        address _leg,
        address _shoe
    ) ERC721("ThatSocks", "TSK") {
        nftContracts[0].backgroundContract = _background;
        nftContracts[0].logoContract = _logo;
        nftContracts[0].patternContract = _pattern;
        nftContracts[0].pegContract = _peg;
        nftContracts[0].legContract = _leg;
        nftContracts[0].shoeContract = _shoe;

        colors = [
            "#EB4545",
            "#FDA2F4",
            "#FF8A01",
            "#FDED5E",
            "#B4E847",
            "#70AE3F",
            "#98C1FF",
            "#3E3BD3",
            "#CF81FF",
            "#D9D9D9",
            "#FFFFFF",
            "#000000"
        ];
    }

    function mintItem() public payable returns (uint256) {
        if (msg.value < price) revert();
        if (_tokenIds >= limit) revert();

        price = (price * curve) / 1000;

        _tokenIds += 1;

        uint256 id = _tokenIds;
        _mint(msg.sender, id);

        socksColors[id][0] = RandomNumber.genertaeRandomNumber(id, 1);
        socksColors[id][1] = RandomNumber.genertaeRandomNumber(id, 2);
        socksColors[id][2] = RandomNumber.genertaeRandomNumber(id, 3);

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "could not send");

        return id;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        if (!_exists(id)) revert();
        return
            TokenUriLibrary._tokenUri(
                id,
                getDescription(id),
                ownerOf(id),
                generateSVGofTokenById(id)
            );
    }

    // function generateSVGofTokenById(uint256 id) internal view returns (string memory) {
    function generateSVGofTokenById(uint256 id)
        internal
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 880 880">',
                    renderTokenById(id),
                    "</svg>"
                )
            );
    }

    function getDescription(uint256 id) public view returns (string memory) {
        string memory desc = "Sock in no Background";

        uint256 backgroundId = socksUpgrades[id].backgroundId;
        if (backgroundId > 0) {
            desc = string.concat(
                " Sock in ",
                NFTContract(nftContracts[0].backgroundContract).getDescription(
                    backgroundId
                ),
                " background"
            );
        }

        uint256 patternId = socksUpgrades[id].patternId;
        if (patternId > 0) {
            desc = string.concat(
                desc,
                ", with mask: ",
                NFTContract(nftContracts[0].patternContract).getDescription(
                    patternId
                )
            );
        }

        uint256 logoId = socksUpgrades[id].logoId;
        if (logoId > 0) {
            desc = string.concat(
                desc,
                ", with a ",
                NFTContract(nftContracts[0].logoContract).getDescription(
                    logoId
                ),
                " logo"
            );
        }

        uint256 shoeId = socksUpgrades[id].shoeId;

        if (shoeId > 0) {
            desc = string.concat(
                desc,
                " and wearing a ",
                NFTContract(nftContracts[0].shoeContract).getDescription(
                    shoeId
                ),
                " footwear"
            );
        }

        return string(abi.encodePacked(desc));
    }

    // Visibility is `public` to enable it being called by other contracts for composition.
    function renderTokenById(uint256 id) public view returns (string memory) {
        string memory render = string(
            abi.encodePacked(
                BodyLibrary.GetRib(colors[socksColors[id][0]]),
                BodyLibrary.GetBody(
                    colors[socksColors[id][1]],
                    colors[socksColors[id][2]]
                )
            )
        );

        uint256 patternId = socksUpgrades[id].patternId;
        if (patternId > 0) {
            render = string(
                abi.encodePacked(
                    render,
                    NFTContract(nftContracts[0].patternContract)
                        .renderTokenById(patternId)
                )
            );
        }

        uint256 logoId = socksUpgrades[id].logoId;
        if (logoId > 0) {
            render = string(
                abi.encodePacked(
                    render,
                    NFTContract(nftContracts[0].logoContract).renderTokenById(
                        logoId
                    )
                )
            );
        }

        uint256 pegId = socksUpgrades[id].pegId;
        if (pegId > 0) {
            render = string(
                abi.encodePacked(
                    NFTContract(nftContracts[0].pegContract)
                        .renderTokenFrontById(pegId),
                    render
                )
            );
        }

        uint256 legId = socksUpgrades[id].legId;
        if (legId > 0) {
            render = string(
                abi.encodePacked(
                    NFTContract(nftContracts[0].legContract).renderTokenById(
                        legId
                    ),
                    render
                )
            );
        }

        render = string(abi.encodePacked(BodyLibrary.getHole(), render));

        uint256 shoeId = socksUpgrades[id].shoeId;
        if (shoeId > 0) {
            render = string(
                abi.encodePacked(
                    NFTContract(nftContracts[0].shoeContract)
                        .renderTokenBackById(shoeId),
                    render,
                    NFTContract(nftContracts[0].shoeContract)
                        .renderTokenFrontById(shoeId)
                )
            );
        }

        if (pegId > 0) {
            render = string(
                abi.encodePacked(
                    NFTContract(nftContracts[0].pegContract)
                        .renderTokenBackById(pegId),
                    render
                )
            );
        }

        uint256 backgroundId = socksUpgrades[id].backgroundId;
        if (backgroundId > 0) {
            render = string(
                abi.encodePacked(
                    NFTContract(nftContracts[0].backgroundContract)
                        .renderTokenById(backgroundId),
                    render
                )
            );
        }

        return render;
    }

    function removeNftFromSocks(address nft, uint256 id) external {
        if (msg.sender != ownerOf(id)) revert();

        if ((nftById[nft][id] == 0)) revert();

        _removeNftFromSocks(nft, id);
    }

    function _removeNftFromSocks(address nftContract, uint256 id) internal {
        if (nftContract == nftContracts[0].backgroundContract) {
            socksUpgrades[id].backgroundId = 0;
        }
        if (nftContract == nftContracts[0].legContract) {
            socksUpgrades[id].legId = 0;
        }
        if (nftContract == nftContracts[0].pegContract) {
            socksUpgrades[id].pegId = 0;
        }
        if (nftContract == nftContracts[0].patternContract) {
            socksUpgrades[id].patternId = 0;
        }
        if (nftContract == nftContracts[0].logoContract) {
            socksUpgrades[id].logoId = 0;
        }
        if (nftContract == nftContracts[0].shoeContract) {
            socksUpgrades[id].shoeId = 0;
        }

        NFTContract(nftContract).transferFrom(
            address(this),
            ownerOf(id),
            nftById[address(nftContract)][id]
        );

        nftById[address(nftContract)][id] = 0;
    }

    // function hasNft(address nft, uint256 id) external view returns (bool) {
    //     // require(nftContractsAvailables[nft], "the bodies can't wear this NFT");

    //     return (nftById[nft][id] != 0);
    // }

    // function nftId(address nft, uint256 id) external view returns (uint256) {
    //     // require(nftContractsAvailables[nft], "the bodies can't wear this NFT");
    //     return nftById[nft][id];
    // }

    // to receive ERC721 tokens
    function onERC721Received(
        address, /*operator*/
        address from,
        uint256 tokenId,
        bytes calldata fancyIdData
    ) external override returns (bytes4) {
        uint256 fancyId = ToUint256._toUint256(fancyIdData);

        // require(ownerOf(fancyId) == from, "you can only add stuff you own.");
        if (ownerOf(fancyId) != from) revert();

        if (nftById[msg.sender][fancyId] != 0) revert();

        nftById[msg.sender][fancyId] = tokenId;

        if (msg.sender == nftContracts[0].backgroundContract) {
            socksUpgrades[fancyId].backgroundId = tokenId;
        }
        if (msg.sender == nftContracts[0].legContract) {
            socksUpgrades[fancyId].legId = tokenId;
        }
        if (msg.sender == nftContracts[0].pegContract) {
            socksUpgrades[fancyId].pegId = tokenId;
        }
        if (msg.sender == nftContracts[0].patternContract) {
            socksUpgrades[fancyId].patternId = tokenId;
        }
        if (msg.sender == nftContracts[0].logoContract) {
            socksUpgrades[fancyId].logoId = tokenId;
        }
        if (msg.sender == nftContracts[0].shoeContract) {
            socksUpgrades[fancyId].shoeId = tokenId;
        }

        return this.onERC721Received.selector;
    }
}
