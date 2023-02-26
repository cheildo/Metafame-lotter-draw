var fs = require('fs');

const writeFile = (address, i) => {

    fs.appendFileSync('./WinnerList.txt', `Winner ${i} : ${address}\n`, function (err) {
        if (err) throw err;
      });
      

    // fs.writeFile("./file.tx", `${variable}\n`, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // }); 
}

module.exports = writeFile;