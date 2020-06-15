// replacement for the console.log() function
// logs only -D command-line argument is provided
// will be mostly used for debugging purposes
export function log(logString: any) {
  if (process.argv.indexOf('-D') !== -1) {
    console.log(logString);
  }
}
