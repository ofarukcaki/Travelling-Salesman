import fs from 'fs';
import { log } from './src/debug';
import { city, distMatrix } from './src/TSP';

/* ======== MAIN ======== */
// array to hold cities vector
let cities: Array<city> = [];

// text input to be processed
const inputFile = process.argv[2];

// read the file and split by CRLF and LF linebreaks
const lines: string[] = fs.readFileSync(inputFile).toString().split(/\r?\n/);

// parse all lines and push to cities array
for (let i = 0; i < lines.length; i++) {
  // do not consider the empty line
  if (lines[i] === '') continue;
  // split the line by space as a Number
  const [id, x, y] = lines[i].split(' ').map(Number);
  // push the new city into cities array
  cities.push({ id, x, y });
}

log(cities);
log(distMatrix(cities));
