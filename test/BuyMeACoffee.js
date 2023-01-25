const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("BuyMeACoffee", function () {
  async function deployOneYearLockFixture() {
    const [owner, account1, account2] = await ethers.getSigners();
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    return { buyMeACoffee, owner, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { buyMeACoffee, owner } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await buyMeACoffee.getOwner()).to.equal(owner.address);
    });
  });

  describe("BuyCoffee function", function () {
    it("Should revert if the value sent is Zero ", async function () {
      const { buyMeACoffee, account1 } = await loadFixture(
        deployOneYearLockFixture
      );

      await expect(
        buyMeACoffee
          .connect(account1)
          .BuyCoffee("randomString1", "randomString2", { value: 0 })
      ).to.be.revertedWith("You cant buy a cofee with 0 eth");
    });

    it("Should Add the sent amount to the contract balance ", async function () {
      const { buyMeACoffee, account1, account2 } = await loadFixture(
        deployOneYearLockFixture
      );

      await buyMeACoffee
        .connect(account1)
        .BuyCoffee("randomString1", "randomString2", { value: 1 });
      await buyMeACoffee
        .connect(account2)
        .BuyCoffee("randomString1", "randomString2", { value: 1 });

      expect(
        await buyMeACoffee.provider.getBalance(buyMeACoffee.address)
      ).to.equal(2);
    });

    it("Should Add the memo to the memo list ", async function () {
      const { buyMeACoffee, account1 } = await loadFixture(
        deployOneYearLockFixture
      );
      await buyMeACoffee
        .connect(account1)
        .BuyCoffee("randomString1", "randomString2", { value: 1 });

      const memolist = await buyMeACoffee.connect(account1).getAllMemos();
      expect(memolist[0].from).to.equal(account1.address);
      expect(memolist[0].name).to.equal("randomString1");
      expect(memolist[0].message).to.equal("randomString2");
    });
  });

  describe("Withdraw Tips function", function () {
    it("Should revert if the value normal account calls the function ", async function () {
      const { buyMeACoffee, account1 } = await loadFixture(
        deployOneYearLockFixture
      );

      await expect(
        buyMeACoffee.connect(account1).WithdrawTips()
      ).to.be.revertedWith("Only Owner allowed to call this function");
    });

    it("Should Transfer all the balance in the contract to owner ", async function () {
      const { buyMeACoffee, owner, account1, account2 } = await loadFixture(
        deployOneYearLockFixture
      );

      await buyMeACoffee
        .connect(account1)
        .BuyCoffee("randomString1", "randomString2", { value: 1 });
      await buyMeACoffee
        .connect(account2)
        .BuyCoffee("randomString1", "randomString2", { value: 1 });

      const prevBalance = await buyMeACoffee.provider.getBalance(owner.address);
      const transaction = await buyMeACoffee.WithdrawTips();
      const receipt = await transaction.wait();
      await new Promise((r) => setTimeout(r, 100));
      const nowBalance = await buyMeACoffee.provider.getBalance(owner.address);
      const difference = nowBalance.sub(prevBalance);
      const gas = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      expect(prevBalance.add(2).sub(gas)).to.equal(nowBalance);
      expect(
        await buyMeACoffee.provider.getBalance(buyMeACoffee.address)
      ).to.equal(0);
    });
  });
});
