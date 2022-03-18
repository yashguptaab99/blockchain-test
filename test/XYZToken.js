const { assert, use } = require('chai');
const { default: Web3 } = require('web3');

const XYZToken = artifacts.require('XYZToken');
require('chai').use(require('chai-as-promised')).should();

contract('XYZToken', ([creator, a, b, c, d, e]) => {
  let XYZtoken;

  before(async () => {
    //Load contracts
    XYZtoken = await XYZToken.new();

    await XYZtoken.mint(a, 5000);
    await XYZtoken.mint(b, 1000);
    await XYZtoken.mint(c, 3000);
    await XYZtoken.mint(d, 900);
    await XYZtoken.mint(e, 100);
  });

  describe('XYZToken deployment', async () => {
    it('token deployed and has a correct name and symbol', async () => {
      const name = await XYZtoken.name();
      assert.equal(name, 'XYZ Token');

      const symbol = await XYZtoken.symbol();
      assert.equal(symbol, 'XYZ');
    });

    it('token minted accordingly', async () => {
      const A_balance = await XYZtoken.balanceOf(a);
      assert.equal(A_balance.toString(), '5000');

      const B_balance = await XYZtoken.balanceOf(b);
      assert.equal(B_balance.toString(), '1000');

      const C_balance = await XYZtoken.balanceOf(c);
      assert.equal(C_balance.toString(), '3000');

      const D_balance = await XYZtoken.balanceOf(d);
      assert.equal(D_balance.toString(), '900');

      const E_balance = await XYZtoken.balanceOf(e);
      assert.equal(E_balance.toString(), '100');
    });

    it('token total supply is correct', async () => {
        const totalSupply = await XYZtoken.totalSupply();
        assert.equal(totalSupply.toString(), '10000');
      });
  });
});
