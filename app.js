const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const {tokenAddress, tokenAbi} = require('./config/config');
const {lotteryAddress, lotteryAbi} = require('./config/config');
const logger = require('./utils/logger');
const writeFile = require('./utils/writeFiles');
const cron = require('node-cron');


console.log(`Program started at ${new Date()}`);
logger.debug(`Program started at ${new Date()}`);
console.log("Token address: ", tokenAddress);
logger.debug(`Token address: ${tokenAddress}`);
console.log("Lottery address: ",lotteryAddress);
logger.debug(`Lottery address: ${lotteryAddress}`);

provider = new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s1.binance.org:8545/`)
const web3 = new Web3(provider);
const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
const lotteryContract = new web3.eth.Contract(lotteryAbi, lotteryAddress);

async function main() {
    
    logger.debug(`..............Starting lottery draw........`);

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const walletAddress= web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(privateKey);
    
    let gasTransfer;
    let numberOfWinners = 5 ;
    let prizes = ['6', '5', '4', '3', '2', '1'];
    let winnerList = [];
    let gasforDraw;

    // Estimate gas for draw
    const estimateGas= await lotteryContract.methods.pickWinner(numberOfWinners)
        .estimateGas({from: walletAddress.address})
        .then(function(gasAmount) {
            console.log(`Gas estimation to draw the lottery is ${gasAmount}`);
            logger.info(`Gas estimation to draw the lottery is ${gasAmount}`);
            gasforDraw = gasAmount;
    });

    // Check main account balance
    const accountBalance = await web3.utils.fromWei(await web3.eth.getBalance(walletAddress.address),'ether');
    console.log(`\nThe main account ${walletAddress.address} balance is: ${accountBalance} BNB.\n`);
    logger.debug(`The main account ${walletAddress.address} balance is: ${accountBalance} BNB.`)

    // Estimate gas for transfer
    const transferGas= await tokenContract.methods.transfer("0xa7d107c6a1f795F8d02Be827fAf429ceD8f82bFA", Web3.utils.toWei('11400', 'ether'))
        .estimateGas({from: walletAddress.address})
        .then(function(gasAmount) {
            console.log(`\nGas estimation for transfering the token is ${gasAmount}\n`)
            gasTransfer =  gasAmount+20000;
    });


    console.log(".......Picking the winners.....\n");
    logger.debug(".......Picking the winners.....");

    // Pick the winners and send 
    const drawLottery = await lotteryContract.methods.pickWinner(numberOfWinners).send({from: walletAddress.address, gas:gasforDraw})
    .then(async function(res) {
        //console.log(res.events.PickWinner.returnValues);
        const getWinnerPool = await lotteryContract.methods.getWinnerPool().call().then(async function(res) {
            //console.log(res);
            winnerList = res;
            console.log(`${winnerList.length} addresses was drawn. \n Congratulation to the winners!`);

            // Write winners to file
            for (let i=1; i<winnerList.length; i++) {
                writeFile(winnerList[i], i);
            }
            console.log(`\nThe winners list was saved to WinnerList.txt\n`);
            logger.debug(`The winners list was saved to WinnerList.txt`);

            const balance = await tokenContract.methods.balanceOf(walletAddress.address).call().then(function(res) {
                console.log('Wallet balance is', res);
            })

            for (let i = 0; i<winnerList.length; i++) {
                if(i==0) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[0], 'ether'))
                    .send({from: walletAddress.address, gas:gasTransfer})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[0]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>0 && i<=2) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[1], 'ether'))
                    .send({from: walletAddress.address, gas:'100000'})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[1]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>2 && i<=5) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[2], 'ether'))
                    .send({from: walletAddress.address, gas:gasTransfer})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[2]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>5 && i<=7) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[3], 'ether'))
                    .send({from: walletAddress.address, gas:gasTransfer})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[3]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                        logger.error(err)
                    });
                }
                else if(i>7 && i<=9) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei( prizes[4], 'ether'))
                    .send({from: walletAddress.address, gas:gasTransfer})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[4]} BMF transfered to ${winnerList[i]}\n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                        logger.error(err)
                    });
                }
                else if(i>9 && i<=11) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[5], 'ether'))
                    .send({from: walletAddress.address, gas:gasTransfer})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} ${prizes[5]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err);
                        logger.error(err)

                    });
                }
                else {
                    console.log("No more winner \n\n");
                    logger.debug("No more winner")
                }
            }
        })
        .catch(function(err){ 
            console.log(err)
        });
    })
    .catch(function(err){ 
         console.log(err)
    });

    console.log("\n\nYay!!! Lottery reward distribution completed! \n\n")
    process.exit(1);

}
       

async function timer(){ 
    
    console.log("\nServer started\n");
    logger.debug("server started");

    await lotteryContract.methods.getCandraw().call().then(async function(res) {
    //console.log(`The status of the lottery is ${res}`)
    if (res === true) {
        await main();
    }
    else {
        console.log("The lottery is not ready to draw yet");
        logger.debug("The lottery is not ready to draw yet");
        await lotteryContract.methods.getCurrentPrize().call().then( function(res) {
            console.log(`The current prize is  ${web3.utils.fromWei(res, 'ether')} BMF`);
        })
        .catch(function(err){ 
            console.log(err);
            logger.error(err)
        });
    }
    })
}

// Schedule tasks to run on the server.
const runServer= async () => {cron.schedule('* * * * *', async() => timer());}

require("dotenv").config();

runServer()
    .catch(error => {
        console.error(error);
        process.exit(1);
    });