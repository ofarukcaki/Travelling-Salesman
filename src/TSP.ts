import { log } from './debug';
// city(node) structure
export interface city {
  id: number;
  x: number;
  y: number;
}

// Construct a distance matrix of cities
export function distMatrix(cities: Array<city>) {
  let matrix: Array<Array<Number>> = new Array(cities.length);

  for (let i = 0; i < cities.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < cities.length; j++) {
      // get distance between twi cities
      const distance = distanceBetween(cities[i], cities[j]);
      // add into distance matrix
      matrix[i].push(distance);
    }
  }
  return matrix;
}

// distance between two cities
function distanceBetween(city1: city, city2: city) {
  const distX = city1.x - city2.x;
  const distY = city1.y - city2.y;
  return Math.round(Math.sqrt(distX ** 2 + distY ** 2));
}

// let city1 = { id: 1, x: 0, y: 2 };
// let city2 = { id: 2, x: 2, y: 3 };

// console.log(distanceBetween(city1, city2));
