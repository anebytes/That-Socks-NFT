pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT


abstract contract NFTContract {
    function renderTokenById(uint256 id)
        external
        view
        virtual
        returns (string memory);

    function renderTokenBackById(uint256 id)
        external
        view
        virtual
        returns (string memory);

    function renderTokenFrontById(uint256 id)
        external
        view
        virtual
        returns (string memory);

    function getDescription(uint256 id)
        external
        view
        virtual
        returns (string memory);

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) external virtual;

    function name() external view virtual returns (string memory);
}