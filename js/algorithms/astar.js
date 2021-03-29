class Node {
    constructor(pos) {
        this.pos = pos;
        this.parent = null;
        this.g = 0;
        this.f = 0;
        this.h = 0;
    }
}

class AStar {
    constructor(grid, start, end) {
        this.grid = grid;
        this.start = start;
        this.end = end;
    }

    solve() {
        let ok = false;
        let openList = [];
        let closedList = [];
        let path = [];
        openList.push(new Node(this.start));

        while (openList.length > 0 && !ok) {
            let lowInd = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[lowInd].f)
                    lowInd = i;
            }

            let currentNode = openList[lowInd];
            if (currentNode.pos == this.end) {
                ok = true;
                let curr = currentNode;
                while (curr.parent) {
                    path.push(curr);
                    curr = curr.parent;
                }
            }

            openList = this.removeNodeFromList(openList, currentNode.pos);
            closedList.push(currentNode);
            let neighbors = this.grid.get(currentNode.pos);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = new Node(neighbors[i]);
                if (this.findNodeInList(closedList, neighbor.pos) || document.getElementById(neighbor.pos).className == "wall") {
                    continue;
                }

                // g = distancia mas corta desde start hasta el nodo actual
                let gScore = currentNode.g + 1; // +1 distancia desde el nodo actual a su vecino
                let gScoreIsBest = false;
                if (!this.findNodeInList(openList, neighbor.pos)) {
                    gScoreIsBest = true;
                    neighbor.h = this.heuristic(neighbor.pos, this.end);
                    openList.push(neighbor);
                }
                else if (gScore < neighbor.g)
                    gScoreIsBest = true;


                if (gScoreIsBest) {
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }

        return { "visited": this.nodesToArray(closedList), "path": this.nodesToArray(path) };
    }

    heuristic(pos0, pos1) {   //calcula la distancia del nodo respecto al punto inicial y al final
        pos0 = pos0.split('-').map(Number);
        pos1 = pos1.split('-').map(Number);
        let d1 = Math.abs(pos1[0] - pos0[0]);
        let d2 = Math.abs(pos1[1] - pos0[1]);

        return d1 + d2;
    }

    removeNodeFromList(list, nodeId) {
        for (let i = 0; i < list.length; i++) {
            if (nodeId == list[i].pos) {
                list.splice(i, 1);
                break;
            }
        }

        return list;
    }

    findNodeInList(list, nodeId) {
        for (let i = 0; i < list.length; i++) {
            if (nodeId == list[i].pos) {
                return true;
            }
        }

        return false;
    }

    nodesToArray(list) {
        let res = [];
        for (let i = 0; i < list.length; i++)
            res.push(list[i].pos);

        return res;
    }
}