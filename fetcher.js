const args = process.argv.splice(2);
const request = require("request");
const fs = require("fs");
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

request(`http://${args[0]}`, (error, response, body) => {
  if (error) {
    console.log(error);
    process.exit();
  }
  fs.access(args[1], fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`${args[1]} does not exist. Creating file ${args[1]}...`);
      fs.writeFile(args[1], `${body}`, 'utf8', (err) => {
        if (err) {
          console.log(`File write returned error: ${err}.\nProgram terminating.`);
        } else {
          console.log(`The data returned from http://${args[0]} has been saved in ${args[1]}`);
        }
        process.exit();
      });
    } else {
      console.log(`${args[1]} exists in current folder. Overwrite? (Y/N)`);
      stdin.on('data', (key) => {
        if (key === "Y" || key === "y") {
          fs.writeFile(args[1], `${body}`, 'utf8', (err) => {
            if (err) {
              console.log(`File write returned error: ${err}.\nProgram terminating.`);
            } else {
              console.log(`The data returned from http://${args[0]} has been saved in ${args[1]}`);
            }
            process.exit();
          });
        } else if (key === "n" || key === "N") {
          console.log(`Terminating program.`);
          process.exit();
        } else if (key === "\u0003") {
          process.exit();
        } else {
          console.log(`You have entered an invalid instruction. Please enter (Y/N):\n`);
        }
      });
    }
  })
  // console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
});
// fs.writeFile(args[1], `${error}\n${response}\n${body}`, 'utf8', (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(`The file has been saved!`);
// });