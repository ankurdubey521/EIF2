// SPDX-License-Identifier: MIT
// Contract matic testnet address : 0x81010d6147Ac567865bB95D31E59569F16716800
pragma solidity 0.7.6;
pragma abicoder v2;

import {
  SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {
  ISuperfluid,
  ISuperToken,
  ISuperAgreement,
  SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {
  IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract SuperFluidTest is SuperAppBase {
  // Superfluid
  ISuperfluid private _superfluid_host; // host
  IConstantFlowAgreementV1 private _superfluid_cfa; // the stored constant flow agreement class address
  ISuperToken private _superfluid_accpeted_token; // accepted token

  // User registration info
  address[] public addressesRegistered;
  mapping(address => bool) public isAddressRegistered;
  event UserRegistered(address user);

  // To determine which users are sending premiums
  uint256 public addressesSendingPremiumsCount = 0;
  mapping(address => bool) public isAddressSendingPremiums;
  event UnderlyingTokenTransferred(address receiver, uint256 amount);

  // User location data
  uint256 public constant locationDecimals = 2;
  mapping(address => uint256[]) public userLocation;

  constructor(
    ISuperfluid host,
    IConstantFlowAgreementV1 cfa,
    ISuperToken acceptedToken
  ) {
    // Verify superfluid addresses
    assert(address(host) != address(0));
    assert(address(cfa) != address(0));
    assert(address(acceptedToken) != address(0));

    // Set superfluid contract addresses
    _superfluid_host = host;
    _superfluid_cfa = cfa;
    _superfluid_accpeted_token = acceptedToken;

    // Register contract with superfluid to enable callback functionality
    uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL;
    _superfluid_host.registerApp(configWord);
    console.log("constructor: contract deployed on address ", address(this));
  }

  function getAllRegisteredAddresses()
    external
    view
    returns (address[] memory)
  {
    return addressesRegistered;
  }

  function registerUser(uint256 scaledLatitude, uint256 scaledLongitude)
    external
  {
    if (!isAddressRegistered[msg.sender]) {
      // Register user
      addressesRegistered.push(msg.sender);
      isAddressRegistered[msg.sender] = true;

      // Store user location
      userLocation[msg.sender] = [ scaledLatitude, scaledLongitude ];
      emit UserRegistered(msg.sender);
    }
  }

  function transferFDaiToAddress(address receiver, uint256 amount) external {
    // Check supertoken balance
    uint256 contractBalance =
      _superfluid_accpeted_token.balanceOf(address(this));
    if (amount > contractBalance) {
      revert("Insufficient SuperToken balance");
    }

    // Check underlying token balance
    _superfluid_accpeted_token.downgrade(amount);
    IERC20 underlyingToken =
      IERC20(_superfluid_accpeted_token.getUnderlyingToken());
    uint256 contractUnderlyingBalance =
      underlyingToken.balanceOf(address(this));
    if (contractUnderlyingBalance < amount) {
      revert("Insufficient Base Token Balance");
    }

    // Do the transfer
    underlyingToken.transfer(receiver, amount);
    emit UnderlyingTokenTransferred(receiver, amount);
  }

  // Superfluid Functions
  modifier onlySuperfluidHost() {
    require(
      msg.sender == address(_superfluid_host),
      "onlySuperfluidHost: callback called from wrong sender"
    );
    _;
  }

  function beforeAgreementCreated(
    ISuperToken, /* superToken */
    address, /* agreementClass */
    bytes32, /*agreementId*/
    bytes calldata, /*agreementData*/
    bytes calldata /*ctx*/
  ) external view override onlySuperfluidHost returns (bytes memory cbdata) {
    cbdata = bytes("");
  }

  function afterAgreementCreated(
    ISuperToken, /* superToken */
    address, /*agreementClass*/
    bytes32, /* agreementId*/
    bytes calldata, /*agreementData*/
    bytes calldata, /*cbdata*/
    bytes calldata ctx
  ) external override onlySuperfluidHost returns (bytes memory newCtx) {
    address sender = _superfluid_host.decodeCtx(ctx).msgSender;

    isAddressSendingPremiums[sender] = true;
    addressesSendingPremiumsCount += 1;
    console.log(
      "afterAgreementCreated: Agreement created by address: ",
      sender
    );
    return ctx;
  }

  function beforeAgreementTerminated(
    ISuperToken, /*superToken*/
    address, /* agreementClass */
    bytes32, /*agreementId*/
    bytes calldata, /*agreementData*/
    bytes calldata /*ctx*/
  ) external view override onlySuperfluidHost returns (bytes memory cbdata) {
    // According to the app basic law, we should never revert in a termination callback
    return bytes("");
  }

  function afterAgreementTerminated(
    ISuperToken, /* superToken */
    address, /* agreementClass */
    bytes32, /* agreementId */
    bytes calldata agreementData,
    bytes calldata, /* cbdata */
    bytes calldata ctx
  ) external override onlySuperfluidHost returns (bytes memory newCtx) {
    // note that msgSender can be either flow sender, receiver or liquidator
    // one must decode agreementData to determine who is the actual player
    (address user, ) = abi.decode(agreementData, (address, address));
    isAddressSendingPremiums[user] = false;
    addressesSendingPremiumsCount -= 1;

    return ctx;
  }
}
