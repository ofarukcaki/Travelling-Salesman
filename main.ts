import { log } from './src/debug';
import {
  city,
  MST,
  match,
  eulerCitcuit,
  convertHamilton,
  hamiltonToTSP,
  twoOpt,
} from './src/TSP';
const fs = require('fs');

function distanceBetween(city1: city, city2: city) {
  const distX = city1.x - city2.x;
  const distY = city1.y - city2.y;
  const res = Math.round(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));
  // console.log(`Dist between ${city1.x},${city1.y} and ${city2.x},${city2.y} is ${res}`);
  return res;
}

function distMatrix(cities: Array<city>) {
  let matrix: Array<Array<number>> = new Array(cities.length);
  for (let i = 0; i < cities.length; i++) {
    matrix[i] = new Array(cities.length);
    for (let j = 0; j < cities.length; j++) {
      // get distance between twi cities
      const distance = distanceBetween(cities[i], cities[j]);
      // add into distance matrix
      // matrix[i].push(distance);
      matrix[i][j] = distance;
    }
  }
  return matrix;
}

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
  const [id, x, y] = lines[i].trim().split(/\s+/).map(Number);
  // push the new city into cities array
  cities.push({ id, x, y });
}

// log(cities);
// cities.forEach((x) => {
//   console.log(x.id, x.x, x.y);
// });

//Create distnace matrix from cities
const matrix = distMatrix(cities);
// console.log(matrix[0]);
// console.log(matrix);
// log(matrix);
// console.log('Length:', cities.length);
//Create minimum spanning tree adjacency list
const adjacencyList = MST(matrix);
// log(adjacencyList);
// adjacencyList.forEach((x) => {
//   // console.log(x);
//   let s = '';
//   x.forEach(y => {
//     s += y + " ";
//   })
//   console.log(s);
// });

// log('--------------');

match(adjacencyList, matrix);

// process.exit();

// log(adjacencyList);

const euler: Array<number> = eulerCitcuit(adjacencyList);

// console.log(`Euler path: ${euler}`);
// console.log(euler);

const hamilton: Array<number> = convertHamilton(euler);
log(`Hamilton: ${hamilton}`);
// console.log(`Hamilton: ${hamilton}`);

let tsp: Array<city> = [];
let cost = hamiltonToTSP(cities, matrix, hamilton, tsp);

console.log(`cost: ${cost}`);
log(tsp);

// if (cities.length < 3000) {
//   cost = twoOpt(tsp);
//   console.log('cost after 2-opt: ', cost);
// }

// prepare the output to print instead writing to a file each time in a loop
// because it is way more slower sicnde it requires to open/close file in each loop
let stringToWrite: string = '';
tsp.forEach((city) => {
  stringToWrite += city.id + '\n';
});

// console.log(stringToWrite);
// set outpur file name
const outputFile = inputFile.replace('.txt', '.out');

// writefilesync method deletes the file if it is already available
// write the cost of the TSP problem to the first line
fs.writeFileSync(outputFile, cost + '\n');
fs.appendFileSync(outputFile, stringToWrite);
