const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

// VERSION 1: Between me and a second wallet
describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner (version1)', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // GET A SECOND ADRRESS
    const signer = ethers.provider.getSigner(0);
    const secondWallet = await signer.getAddress()
    
    // Link him to me
    const tx = await game.write(secondWallet)

    // Find my Address
    const myWallet = tx.to

    // Connect to him, and link me to him
    await game.connect(signer).write(myWallet)

    // And finally call .win(A or B)
    await game.win(secondWallet)

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});




// VERSION 2: Between 2 other wallets
describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner (version2)', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // AN ADRRESS
    const signerA = ethers.provider.getSigner(0);
    const walletA = await signerA.getAddress()

    // ANOTHER ADRRESS
    const signerB = ethers.provider.getSigner(1);
    const walletB = await signerB.getAddress()

    // Connect through A, link B to him
    const tellme = await game.connect(signerA).write(walletB)
    // console.log(tellme)
    
    // Connect through B, link A to him
    await game.connect(signerB).write(walletA)

    // And finally call .win(A or B)
    await game.connect(signerA).win(walletB)

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
