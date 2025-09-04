// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

contract Batcher {
    struct callDataStruct {
        address to;
        uint256 value;
        bytes data;
    }

    error NotOwner(address caller, address owner);

    address private immutable owner = tx.origin;

    modifier onlyOwner() {
        require(tx.origin == owner, NotOwner(tx.origin, owner));
        _;
    }

    function batch(
        callDataStruct[] memory _callData
    ) external payable onlyOwner {
        for (uint256 i = 0; i < _callData.length; i++) {
            (bool success, bytes memory result) = _callData[i].to.call{
                value: _callData[i].value
            }(_callData[i].data);

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
}
