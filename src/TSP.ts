import { log } from './debug';
// city(node) structure
export interface city {
  id: number;
  x: number;
  y: number;
}

// Construct a distance matrix of cities
export function distMatrix(cities: Array<city>) {
  let matrix: Array<Array<number>> = new Array(cities.length);

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

function minKey(key: Array<number>, mstSet: Array<boolean>, size: number): number {
  let min = Number.MAX_SAFE_INTEGER;
  let minIndex: number = 0;

  for (let i = 0; i < size; i++) {
    if (mstSet[i] === false && key[i] < min) {
      min = key[i];
      minIndex = i;
    }
  }
  return minIndex;
}

//
export function MST(matrix: Array<Array<number>>) {
  const size = matrix.length;

  // MST as adj. list
  let parent: Array<number> = new Array(size);
  fill(parent, -1);
  let key: Array<number> = new Array(size);
  fill(key, Number.MAX_SAFE_INTEGER);
  // array of unvisited nodes, true: visited, udnefined: unvisited
  let mstSet: Array<boolean> = new Array(size);
  fill(mstSet,false)

  key[0] = 0;
  parent[0] = -1;

  for (let i = 0; i < size - 1; i++) {
    // Pick the minimum key vertex from the set of vertices
    // not yet included in MST
    let u = minKey(key, mstSet, size);
    // console.log('minkey: ', u);
    // console.log(parent);

    mstSet[u] = true;

    // add the picked vertex to the MST set
    for (let v = 0; v < size; v++) {
      if (matrix[u][v] && mstSet[v] === false && matrix[u][v] < key[v]) {
        parent[v] = u;
        key[v] = matrix[u][v];
      }
    }
  }

  //Add edges from parent into MST adjacency list
    let mst: Array<Array<number>> = [];
    // cosntruct empty 2-dimensional array
    for (let i = 0; i < parent.length; i++) {
      mst.push([]);
    }

    for (let i = 1; i < parent.length; i++) {
      mst[i].push(parent[i]);
      mst[parent[i]].push(i);
    }

    return mst;
}

// fill the given array with provided value
function fill(array: Array<any>, content: any) {
  for (let i = 0; i < array.length; i++) {
    array[i] = content;
  }
}


//  