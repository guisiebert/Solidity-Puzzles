const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }


  let i = 1
  const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;

  async function getAddress() {
    while (true) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
      const walletAddress = await wallet.getAddress()
      console.log(walletAddress.slice(0,4))
      
      if (walletAddress < threshold) {
          return {wallet, walletAddress}
      }

    }
  }

  it('should be a winner', async function () {
    
    const { game } = await loadFixture(deployContractAndSetVariables);
    
    // Searching for an address below threshold
    const { wallet, walletAddress } = await getAddress();
    console.log("FOUND!", walletAddress)

    // Address has NO funds for gas. Sending some.
    const signer = ethers.provider.getSigner(0)

    await signer.sendTransaction({
      to: walletAddress,
      value: ethers.utils.parseEther("1")
    })

    console.log('balance is now: ', await ethers.provider.getBalance(wallet.address))


    // Connecting to the address found
    await game.connect(wallet).win()
    


    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
