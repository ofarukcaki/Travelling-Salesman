import { log } from './debug';
// city(node) structure
export interface city {
  id: number;
  x: number;
  y: number;
}

// distance between two cities
function distanceBetween(city1: city, city2: city) {
  const distX = city1.x - city2.x;
  const distY = city1.y - city2.y;
  const res = Math.round(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));
  // console.log(`Dist between ${city1.x},${city1.y} and ${city2.x},${city2.y} is ${res}`);
  return res;
}

// let city1 = { id: 1, x: 0, y: 2 };
// let city2 = { id: 2, x: 2, y: 3 };

// console.log(distanceBetween(city1, city2));

function minKey(
  key: Array<number>,
  mstSet: Array<boolean>,
  size: number
): number {
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
export function MST(matrix: Array<Array<number>>): Array<Array<number>> {
  const size = matrix.length;

  // MST as adj. list
  let parent: Array<number> = new Array(size);
  fill(parent, -1);
  let key: Array<number> = new Array(size);
  fill(key, Number.MAX_SAFE_INTEGER);
  // array of unvisited nodes, true: visited, udnefined: unvisited
  let mstSet: Array<boolean> = new Array(size);
  fill(mstSet, false);

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

// Algorithm for matching odd degree vertices in the MST to the ones closest to it. Will provide a near-minimal perfect matching
export function match(
  mst: Array<Array<number>>,
  distMatrix: Array<Array<number>>
): void {
  // size of the minimum spanning tree
  const size = mst.length;

  let oddVertices: Array<number> = [];
  for (let i = 0; i < size; i++) {
    if (mst[i].length % 2 !== 0) {
      oddVertices.push(i);
    }
  }

  //Match each odd degree vertex with the odd degree vertex closest to it
  while (oddVertices.length > 0) {
    const size: number = oddVertices.length;
    let dist: number = Number.MAX_SAFE_INTEGER;
    let close: number = 0;

    //Find the closest vertex to the current first vertex in the oddVertices vector
    for (let i = 1; i < size; i++) {
      if (distMatrix[oddVertices[0]][oddVertices[i]] < dist) {
        dist = distMatrix[oddVertices[0]][oddVertices[i]];
        close = i;
      }
    }

    //After match is found, add an edge between them
    mst[oddVertices[0]].push(oddVertices[close]);
    mst[oddVertices[close]].push(oddVertices[0]);

    //Remove the matched indices
    oddVertices.splice(close, 1);
    // remove first item
    oddVertices.splice(0, 1);
  }
}

export function eulerCitcuit(adjList: Array<Array<number>>) {
  let edgeCount = new Map();

  for (let i = 0; i < adjList.length; i++) {
    edgeCount.set(i, adjList[i].length);
  }

  // Maintain a stack to keep vertices
  let curr_path: Array<number> = [];

  // vector to store final circuit
  let circuit: Array<number> = [];

  // start from any vertex
  curr_path.unshift(0);
  let curr_v: any = 0; // Current vertex

  while (curr_path.length !== 0) {
    // if there is a remaining edge
    if (edgeCount.get(curr_v)) {
      // if exist in the map
      // push to the stack
      curr_path.unshift(curr_v);

      // element at the last index
      let next_v = adjList[curr_v][adjList[curr_v].length - 1];

      // and remove that edge from both vertices edge list
      let prev = edgeCount.get(curr_v);
      // decrease by one
      edgeCount.set(curr_v, prev - 1);
      adjList[curr_v].pop(); // remove last element

      for (let i = 0; i < adjList[next_v].length; i++) {
        if (adjList[next_v][i] == curr_v) {
          adjList[next_v].splice(i, 1);
          edgeCount.set(next_v, edgeCount.get(next_v) - 1);
          break;
        }
      }

      // move to the next vertex
      curr_v = next_v;
    }

    // find remainig circuit
    else {
      circuit.unshift(curr_v);
      // remove and return first element
      curr_v = curr_path.shift();
    }
  }
  return circuit.reverse();
}

// function that receives a euler cycle and convert to hamilton cycle
export function convertHamilton(euler: Array<number>): Array<number> {
  const size = euler.length;
  let visited: Array<boolean> = new Array(size);
  fill(visited, false);

  let tspCircuit: Array<number> = [];
  for (let i = 0; i < size; i++) {
    if (!visited[euler[i]]) {
      tspCircuit.push(euler[i]);
    }
    // set as visited
    visited[euler[i]] = true;
  }

  return tspCircuit;
}

// return the TSP cost while constructing a TSP path
export function hamiltonToTSP(
  cities: Array<city>,
  matrix: Array<Array<number>>,
  hamilton: Array<number>,
  tsp: Array<city>
): number {
  let cost = 0;
  // console.log(hamilton);
  // console.log(hamilton.length);
  for (let i = 0; i < hamilton.length - 1; i++) {
    // console.log(i, hamilton[i], hamilton[i + 1]);
    // cost between two city
    cost += matrix[hamilton[i]][hamilton[i + 1]];
    tsp.push(cities[hamilton[i]]);
  }

  // lastly, add the first city to end of the path to complate the full path.
  const last = hamilton[hamilton.length - 1];
  tsp.push(cities[last]);
  cost += matrix[hamilton[0]][last];

  return cost;
}

function getTravelCost(path: Array<city>) {
  let cost = 0;

  for (let i = 0; i < path.length - 1; i++)
    cost += distanceBetween(path[i], path[i + 1]);

  return cost;
}

function swap(path: Array<city>, i: number, j: number) {
  // new path
  let newPath: Array<city> = [];
  const size = path.length;

  // from path[0] to path[i-1] stays the same
  for (let k = 0; k <= i - 1; k++) {
    newPath.push(path[k]);
  }

  // add from path[i] to path[j] in reverse order to new path
  for (let k = j; k >= i; k--) {
    newPath.push(path[k]);
  }

  // add from path[j+1] to end to new tour
  for (let k = j + 1; k < size; k++) {
    newPath.push(path[k]);
  }

  return newPath;
}

export function twoOpt(path: Array<city>) {
  // add the first city to end of the path to complate the full path.
  path.push(path[0]);

  let numCities = path.length - 1;
  let currentCost = getTravelCost(path);
  let improve: boolean;

  do {
    improve = false;

    for (let i = 1; i < numCities - 1; i++) {
      for (let j = 1; j < numCities; j++) {
        // perform a swap operation and compare costs
        let newPath: Array<city> = [...path];
        newPath = swap(newPath, i, j);
        const newCost = getTravelCost(newPath);

        // check if the new solution is better thanthe old one
        if (newCost < currentCost) {
          path = [...newPath];
          improve = true;
          currentCost = newCost;
        }
      }
    }
  } while (improve === true);

  return { cost: currentCost, path: path };
}
