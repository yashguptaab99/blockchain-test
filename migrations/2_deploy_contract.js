const XYZToken = artifacts.require('./XYZToken.sol');
const ABCToken = artifacts.require('./ABCToken.sol');
const Staking = artifacts.require('./Staking.sol');

module.exports = async function (deployer, network, addresses) {
  await deployer.deploy(ABCToken);
  const ABC = await ABCToken.deployed();

  await deployer.deploy(XYZToken);
  const XYZ = await XYZToken.deployed();

  await XYZ.mint(addresses[1], 5000);
  await XYZ.mint(addresses[2], 1000);
  await XYZ.mint(addresses[3], 3000);
  await XYZ.mint(addresses[4], 900);
  await XYZ.mint(addresses[5], 100);

  await deployer.deploy(Staking, ABC.address, XYZ.address);
  const staking = await Staking.deployed();
};
