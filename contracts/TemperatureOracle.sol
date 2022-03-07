// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract TemperatureOracle {
    mapping(address => bool) private admins;
    int128 private temperature;
    uint8 private unit;

    modifier onlyAdmin {
        require(admins[msg.sender] == true, "Only admin can access this function.");
        _;
    }

    constructor (uint8 _unit) {
        require(_unit < 2, "Invalid temperature unit"); // 0 = celsius, 1 = fahrenheit
        admins[msg.sender] = true;
        unit = _unit;
    }

    function decimals() public pure returns (uint8) {
        return 2;
    }

    function toggleAdmin(address _addr) public onlyAdmin {
        admins[_addr] = !admins[_addr];
    }

    function setTemperature(int128 _temperature) public onlyAdmin {
        temperature = _temperature;
    }

    function celsius() public view returns (int128) {
        return unit == 0 ? temperature : convert(temperature, 0);
    }

    function fahrenheit() public view returns (int128) {
        return unit == 1 ? temperature : convert(temperature, 1);
    }

    function convert(int128 _temperature, uint8 _type) private pure returns (int128) {
        int128 value;
        if (_type == 0) {
            value = int128(_temperature - 3200) * 5 / 9;
        } else {
            value = (_temperature * 9 / 5) + 3200;
        }
        return value;
    }
}
