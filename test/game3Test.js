const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signerA = ethers.provider.getSigner(0);
    const signerB = ethers.provider.getSigner(1);
    const signerC = ethers.provider.getSigner(2);

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    // const address = await signer.getAddress();

    return { game, signerA, signerB, signerC };
  }

  it('should be a winner', async function () {
    const { game, signerA, signerB, signerC } = await loadFixture(deployContractAndSetVariables);

    
    // STEP 1: I need to connect to 3 different wallets
    // STEP 2: I need to call .buy() on each one and send different values

    // Wallet A
    await game.connect(signerA).buy({ value: '1' });
    const walletA = await signerA.getAddress()

    // Wallet B
    await game.connect(signerB).buy({ value: '2' });
    const walletB = await signerB.getAddress()

    // Wallet C
    await game.connect(signerC).buy({ value: '3' });
    const walletC = await signerC.getAddress()

    
    // STEP 3: Call game.win() with the 3 wallets in the expected order
    // EXPECTED: 0 < param3 < param1 < param2

    await game.win(walletB, walletC, walletA);
    

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
