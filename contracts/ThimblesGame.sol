// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ThimblesGame {
    address public owner;

    event GamePlayed(address indexed player, bool won, uint256 amountWon);
    event Withdrawal(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function playGame() public payable {
        require(msg.value > 0, "Must send ETH to play");

        bool won = _random() % 2 == 0; // Simple pseudo-randomness

        if (won) {
            uint256 amountWon = msg.value * 2 + msg.value;
            require(address(this).balance >= amountWon, "Contract balance too low");
            (bool success, ) = msg.sender.call{value: amountWon}("");
            require(success, "Transfer failed");
            emit GamePlayed(msg.sender, true, amountWon);
        } else {
            emit GamePlayed(msg.sender, false, 0);
        }
    }

    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));
    }

    // Owner can withdraw ETH from the contract
    function withdrawETH(uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        emit Withdrawal(owner, amount);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}