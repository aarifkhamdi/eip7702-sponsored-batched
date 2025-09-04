// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

contract Wallet {
    address private immutable owner = tx.origin;

    error NotOwner(address caller, address owner);

    modifier onlyOwner() {
        require(tx.origin == owner, NotOwner(tx.origin, owner));
        _;
    }

    function call(
        address _to,
        uint256 _value,
        bytes memory _data
    ) external payable onlyOwner {
        (bool success, bytes memory result) = _to.call{value: _value}(_data);

        if (!success) {
            if (result.length > 0) {
                assembly {
                    let returndata_size := mload(result)
                    revert(add(32, result), returndata_size)
                }
            } else {
                revert("Call failed with no error message");
            }
        }
    }
}
