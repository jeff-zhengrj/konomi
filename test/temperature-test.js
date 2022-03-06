const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TemperatureOracle", function () {
    let TemperatureOracle;
    let data;

    beforeEach(async function() {
        TemperatureOracle = await ethers.getContractFactory("TemperatureOracle");
    });

    it("should create the oracle as celsius", async function () {
        const oracle = await TemperatureOracle.deploy(0);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(1000);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("1000");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("5000");
    });
    
    it("should create the oracle as fahrenheit", async function () {
        const oracle = await TemperatureOracle.deploy(1);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(5000);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("1000");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("5000");
    });

    it("should accept negative celsius temperature", async function () {
        const oracle = await TemperatureOracle.deploy(0);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(-1000);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("-1000");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("1400");
    });

    it("should accept negative fahrenheit temperature", async function () {
        const oracle = await TemperatureOracle.deploy(1);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(-1000);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("-2333");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("-1000");
    });

    it("should accept 0 celsius temperature", async function () {
        const oracle = await TemperatureOracle.deploy(0);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(0);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("0");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("3200");
    });

    it("should accept 0 fahrenheit temperature", async function () {
        const oracle = await TemperatureOracle.deploy(1);
        await oracle.deployed();

        const setTemperature = await oracle.setTemperature(0);
        await setTemperature.wait();

        data = await oracle.celsius();
        expect(data.toString()).to.equal("-1777");
        data = await oracle.fahrenheit();
        expect(data.toString()).to.equal("0");
    });

    it("should not allow non-admin to set temperature", async function () {
        const oracle = await TemperatureOracle.deploy(0);
        await oracle.deployed();

        const [owner, addr1] = await ethers.getSigners();

        await expect(oracle.connect(addr1).setTemperature(0)).to.be.reverted;
    });
});
