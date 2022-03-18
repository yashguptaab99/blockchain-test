const XYZToken = artifacts.require('./XYZToken.sol');
module.exports = async function(deployer, network, addresses) {

    await deployer.deploy(XYZToken);
    const XYZ = await XYZToken.deployed()
    
    await XYZ.mint(addresses[1], 5000)
    await XYZ.mint(addresses[2], 1000)
    await XYZ.mint(addresses[3], 3000)
    await XYZ.mint(addresses[4], 900)
    await XYZ.mint(addresses[5], 100)

};