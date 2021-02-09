// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract PizzaTokens {
    uint256 totalTokenSupply;
    address tokenCreator;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    constructor(uint256 _totalSupply) {
        totalTokenSupply = _totalSupply;
        tokenCreator = msg.sender;
        balances[msg.sender] = _totalSupply;

        console.log(
            "Token contract initialized with ",
            totalTokenSupply,
            " tokens"
        );
    }

    /**
     * @dev Return total supply of the erc20 token
     * @return uint256
     */
    function totalSupply() public view returns (uint256) {
        return totalTokenSupply;
    }

    /**
     * @dev Return amount of tokens held by an address
     * @param tokenOwner address of owner
     * @return uint256
     */
    function balanceOf(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }

    /**
     * @dev Return remianing amount of tokens approved to be spent by spender approved by tokenOwner
     * @param tokenOwner address of owner
     * @param spender address of spender
     * @return uint256
     */
    function allowance(address tokenOwner, address spender)
        public
        view
        returns (uint256)
    {
        return allowed[tokenOwner][spender];
    }

    /**
     * @dev Transfers ERC20 Tokens to another account
     * @param to address of reciever
     * @param tokens amount of tokens to be sent
     * @return bool status of transaction
     */
    function transfer(address to, uint256 tokens) public returns (bool) {
        require(balances[msg.sender] >= tokens, "INSUFFICIENT_FUNDS");

        balances[msg.sender] = balances[msg.sender] -= tokens;
        balances[to] = balances[to] += tokens;
        emit Transfer(msg.sender, to, tokens);

        console.log("Transferred ", tokens, " tokens");
        console.log("From: ", msg.sender, ", To: ", to);

        return true;
    }

    /**
     * @dev Allows spending of tokens to be delegated to another account
     * @param spender address of spender
     * @param tokens amont of tokens to be approved
     * @return bool status of transaction
     */
    function approve(address spender, uint256 tokens) public returns (bool) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);

        console.log("Approved ", tokens, " tokens");
        console.log("Owner: ", msg.sender, ", spender: ", spender);

        return true;
    }

    /**
     * @dev Transfer ERC20 tokens preapproved by a delegated account to another address
     * @param from address of owner of tokens
     * @param to address of reciever
     * @param tokens amount of tokens to be sent
     * @return bool status of transaction
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) public returns (bool) {
        require(balances[msg.sender] >= tokens, "INSUFFICIENT_FUNDS");
        require(allowed[from][msg.sender] >= tokens, "APPROVED_LIMIT_EXCEEDED");

        balances[from] = balances[from] -= tokens;
        allowed[from][msg.sender] = allowed[from][msg.sender] -= tokens;
        balances[to] = balances[to] += tokens;
        emit Transfer(from, to, tokens);

        console.log("Transferred ", tokens, " tokens");
        console.log("From: ", from, ", To: ", to);
        console.log("Initiated by: ", msg.sender);

        return true;
    }
}
