const ServerABI = require('./abi.js');
const BrokerABI = require('./abi.js');
const AgreementABI = require('./abi.js');
const { ethers } = require('ethers');

const RPC_URL = process.env.RPC_URL;
const BROKER_CONTRACT_ADDRESS = "";
const SERVER_CONTRACT_ADDRESS = "";


class ContractInteract {
    wallet;
    BrokerContract;
    ServerContract;


    constructor(privateKey) {
        this.wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(RPC_URL));
        this.BrokerContract = new ethers.Contract(BROKER_CONTRACT_ADDRESS, BrokerABI, this.wallet);
        this.ServerContract = new ethers.Contract(SERVER_CONTRACT_ADDRESS, ServerABI, this.wallet);
    }

    async readTokenBalance(publicKey) {
        return await this.BrokerContract.balanceOf(this.wallet.address);
    }

    async detractFunds(publicKey, amount) {
        return await this.BrokerContract.transfer(publicKey, amount);
    }



}

export default ContractInteract;