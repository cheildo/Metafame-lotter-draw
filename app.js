const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const tokenAddress = require('./config/config').tokenAddress;
const tokenAbi = require('./config/config').tokenAbi;
const lotteryAddress = require('./config/config').lotteryAddress;
const lotteryAbi = require('./config/config').lotteryAbi;

console.log("Token address: ", tokenAddress);
console.log("Lottery address: ",lotteryAddress);

async function main() {
    
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    provider = new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s1.binance.org:8545`)
    const web3 = new Web3(provider);
      
    const walletAddress= web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log("Hi the signer is", walletAddress.address);
      
    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    const lotteryContract = new web3.eth.Contract(lotteryAbi, lotteryAddress);

    web3.eth.accounts.wallet.add(privateKey);
    // const checkWallet = await web3.eth.accounts.wallet;
    // console.log("The wallet object is", checkWallet);
    // web3.eth.defaultAccount = walletAddress.address;
    let gaslimit;
    let numberOfWinners = 10;
    let prizes = ['6', '5', '4', '3', '2', '1'];
    //console.log(`The highest reward is ${prizes[0] }`);
    let winnerList = [];
    let gasforDraw;
    const estimateGas= await lotteryContract.methods.pickWinner(numberOfWinners)
        .estimateGas({from: walletAddress.address})
        .then(function(gasAmount) {
            console.log(`Gas estimation is ${gasAmount}`)
            gasforDraw = gasAmount;
    });

    // Estimate gas for transfer
    const transtferGas= await tokenContract.methods.transfer("0xa7d107c6a1f795F8d02Be827fAf429ceD8f82bFA", Web3.utils.toWei('11400', 'ether'))
        .estimateGas({from: walletAddress.address})
        .then(function(gasAmount) {
            console.log(`\nGas estimation for transfering the token is ${gasAmount}`)
            gaslimit =  gasAmount;
    });
    
    const drawLottery = await lotteryContract.methods.pickWinner(numberOfWinners).send({from: walletAddress.address, gas:gasforDraw})
    .then(async function(res) {
        const getWinnerPool = await lotteryContract.methods.getWinnerPool().call().then(async function(res) {
            //console.log(res);
            winnerList = res;
            console.log(`${winnerList.length} addresses was drawn. \n Congratulation to the winners!`);

            const balance = await tokenContract.methods.balanceOf(walletAddress.address).call().then(function(res) {
                console.log('Wallet balance is', res);
            })

            for (let i = 0; i<winnerList.length; i++) {
                if(i==0) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[0], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[0]} BMF successfull to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>0 && i<=2) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[1], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[1]} BMF successfull to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>2 && i<=5) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[2], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[2]} BMF successfully transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>5 && i<=7) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[3], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[3]} BMF successfull transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>7 && i<=9) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei( prizes[4], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} \n${prizes[4]} BMF transfered to ${winnerList[i]}`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else if(i>9 && i<=11) {
                    const transferToken = await tokenContract.methods.transfer(winnerList[i], Web3.utils.toWei(prizes[5], 'ether'))
                    .send({from: walletAddress.address, gas:gaslimit})
                    .then(function(res) {
                        //console.log(res.events.Transfer.returnValues);
                        console.log(`Pick ${i} ${prizes[5]} BMF transfered to ${winnerList[i]} \n\n`);        
                    })
                    .catch(function(err){ 
                        console.log(err)
                    });
                }
                else {
                    console.log("No more winner \n\n");
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
    
  // Estimatic the gas limit
    // var limit = await web3.eth.estimateGas({
    // from: walletAddress.address, 
    // to: winner,
    // value: web3.utils.toWei("0.001")
    // }).then(console.log);

}

require("dotenv").config();

main()
    .catch(error => {
        console.error(error);
        process.exit(1);
    });