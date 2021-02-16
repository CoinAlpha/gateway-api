import { logger } from './logger';

const fetch = require('cross-fetch');

const Ethers = require('ethers')
const AmmArtifact = require("@perp/contract/build/contracts/Amm.json")
const ClearingHouseArtifact = require("@perp/contract/build/contracts/ClearingHouse.json")
const RootBridgeArtifact = require("@perp/contract/build/contracts/RootBridge.json")
const ClientBridgeArtifact = require("@perp/contract/build/contracts/ClientBridge.json")
const ClearingHouseViewerArtifact = require("@perp/contract/build/contracts/ClearingHouseViewer.json")
const TetherTokenArtifact = require("@perp/contract/build/contracts/TetherToken.json")

const GAS_LIMIT = 150688;
const DEFAULT_DECIMALS = 18
const CONTRACT_ADDRESSES = "https://metadata.perp.exchange/"
const XDAI_PROVIDER = "https://rpc.xdaichain.com"
const PNL_OPTION_SPOT_PRICE = 0

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


export default class PerpetualFinance {
  constructor (network = 'mainnet') {
    this.providerUrl = XDAI_PROVIDER
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new Ethers.providers.JsonRpcProvider(this.providerUrl)
    this.gasLimit = GAS_LIMIT
    this.contractAddressesUrl = CONTRACT_ADDRESSES
    this.amm = {}


    switch (network) {
      case 'mainnet':
        this.contractAddressesUrl += 'production.json';
        break;
      case 'kovan':
        this.contractAddressesUrl += 'staging.json';
        break;
      default:
        const err = `Invalid network ${network}`
        logger.error(err)
        throw Error(err)
    }

    this.loadedMetadata = this.load_metadata()

  }

  async load_metadata() {
    try{
      const metadata = await fetch(this.contractAddressesUrl).then(res => res.json())
      const layer2 = Object.keys(metadata.layers.layer2.contracts)

      for (var key of layer2){
        if (metadata.layers.layer2.contracts[key].name === "Amm") {
          this.amm[key] = metadata.layers.layer2.contracts[key].address;
        } else{
          this[key] = metadata.layers.layer2.contracts[key].address;
        }
      }

      this.layer2AmbAddr = metadata.layers.layer2.externalContracts.ambBridgeOnXDai
      this.xUsdcAddr = metadata.layers.layer2.externalContracts.usdc
      this.loadedMetadata = true
      return true
    } catch(err) {
      return false
    }

  }

  // get XDai balance
  async getXdaiBalance (wallet) {
    try {
      const xDaiBalance = await wallet.getBalance()
      return Ethers.utils.formatEther(xDaiBalance)
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error xDai balance lookup'
      return reason
    }
  }

  // get XDai USDC balance
  async getUSDCBalance (wallet) {
    try {
      const layer2Usdc = new Ethers.Contract(this.xUsdcAddr, TetherTokenArtifact.abi, wallet)
      let layer2UsdcBalance = await layer2Usdc.balanceOf(wallet.address)
      const layer2UsdcDecimals = await layer2Usdc.decimals()
      return Ethers.utils.formatUnits(layer2UsdcBalance, layer2UsdcDecimals)
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error balance lookup'
      return reason
    }
  }

  // get  allowance
  async getAllowance (wallet) {
    // instantiate a contract and pass in provider for read-only access
    const layer2Usdc = new Ethers.Contract(this.xUsdcAddr, TetherTokenArtifact.abi, wallet)

    try {
      const allowanceForClearingHouse = await layer2Usdc.allowance(
      wallet.address,
      this.ClearingHouse
      )

      return Ethers.utils.formatUnits(allowanceForClearingHouse, DEFAULT_DECIMALS)
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error allowance lookup'
      return reason
    }
  }

  // approve
  async approve (wallet, amount) {
    try {
      // instantiate a contract and pass in wallet
      const layer2Usdc = new Ethers.Contract(this.xUsdcAddr, TetherTokenArtifact.abi, wallet)
      const tx = await layer2Usdc.approve(this.ClearingHouse, Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS))
      // TO-DO: We may want to supply custom gasLimit value above
      return tx.hash
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error approval'
      return reason
    }
  }

  //open Position
  async openPosition(side, margin, levrg, pair, wallet) {
    try {
      const quoteAssetAmount = { d: Ethers.utils.parseUnits(margin, DEFAULT_DECIMALS) }
      const leverage = { d: Ethers.utils.parseUnits(levrg, DEFAULT_DECIMALS) }
      const minBaseAssetAmount = { d: "0" } // "0" can be automatically converted
      const clearingHouse = new Ethers.Contract(this.ClearingHouse, ClearingHouseArtifact.abi, wallet)
      const tx = await clearingHouse.openPosition(
        this.amm[pair],
        side,
        quoteAssetAmount,
        leverage,
        minBaseAssetAmount
      )
      return tx
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error opening position'
      return reason
    }
  }

  //close Position
  async closePosition(wallet, pair) {
    try {
      const minimalQuoteAsset = {d: "0"}
      const clearingHouse = new Ethers.Contract(this.ClearingHouse, ClearingHouseArtifact.abi, wallet)
      const tx = await clearingHouse.closePosition(this.amm[pair], minimalQuoteAsset)
      return tx
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error closing position'
      return reason
    }
  }

  //get active position
  async getPosition(wallet,  pair) {
    try {
      const positionValues = {}
      const clearingHouseViewer = new Ethers.Contract(this.ClearingHouseViewer, ClearingHouseViewerArtifact.abi, wallet)
      await Promise.allSettled([clearingHouseViewer.getPersonalPositionWithFundingPayment(this.amm[pair],
                                                                                          wallet.address),
                                clearingHouseViewer.getUnrealizedPnl(this.amm[pair],
                                                                     wallet.address,
                                                                     Ethers.BigNumber.from(PNL_OPTION_SPOT_PRICE))])
              .then(values => {positionValues.openNotional = Ethers.utils.formatUnits(values[0].value.openNotional.d, DEFAULT_DECIMALS);
                              positionValues.size = Ethers.utils.formatUnits(values[0].value.size.d, DEFAULT_DECIMALS);
                              positionValues.pnl = Ethers.utils.formatUnits(values[1].value.d);})

      positionValues.entryPrice = Math.abs(positionValues.openNotional / positionValues.size)
      return positionValues
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error getting active position'
      return reason
    }
  }

  //get active margin
  async getActiveMargin(wallet) {
    try {
      const clearingHouseViewer = new Ethers.Contract(this.ClearingHouseViewer, ClearingHouseViewerArtifact.abi, wallet)
      const activeMargin = await clearingHouseViewer.getPersonalBalanceWithFundingPayment(
      this.xUsdcAddr,
      wallet.address)
      return activeMargin / 1e18.toString()
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error getting active position'
      return reason
    }
  }

  // get Price
  async getPrice(side, amount, pair) {
    try {
      let price
      const amm = new Ethers.Contract(this.amm[pair], AmmArtifact.abi, this.provider)
      if (side === "buy") {
      price = await amm.getInputPrice(0, {d: Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS) })
      price =  amount / Ethers.utils.formatUnits(price.d)
    } else {
      price = await amm.getOutputPrice(0, {d: Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS) })
      price = Ethers.utils.formatUnits(price.d) / amount
    }
      return price
    } catch (err) {
      console.log(err)
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error getting Price'
      return reason
    }
  }

  // get getFundingRate
  async getFundingRate(pair) {
    try {
      let funding = {}
      const amm = new Ethers.Contract(this.amm[pair], AmmArtifact.abi, this.provider)
      await Promise.allSettled([amm.getUnderlyingTwapPrice(3600),
                                amm.getTwapPrice(3600),
                                amm.nextFundingTime()])
              .then(values => {funding.indexPrice = Ethers.utils.formatUnits(values[0].value.d);
                              funding.markPrice = Ethers.utils.formatUnits(values[1].value.d);
                              funding.nextFundingTime = values[2].value.toString();})

      funding.rate = ((funding.markPrice - funding.indexPrice) / 24) / funding.indexPrice
      return funding
    } catch (err) {
      console.log(err)
      logger.error(err)()
      let reason
      err.reason ? reason = err.reason : reason = 'error getting fee'
      return reason
    }
  }

}
