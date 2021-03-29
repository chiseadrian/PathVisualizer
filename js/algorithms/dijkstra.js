class Dijkstra {
    constructor(grid, start, end) {
        this.grid = grid;
        this.start = start;
        this.end = end;
    }

    solve() {
        let solutions = {};
        let visited = [];
        solutions[this.start] = [];
        //solutions[this.start].dist = 0;

        while (true) {
            let parent = null;
            let nearest = null;
            let dist = Infinity;

            for (var n in solutions) {
                let neighbors = this.grid.get(n);
                for (let i = 0; i < neighbors.length; i++) {
                    if (solutions[neighbors[i]])
                        continue;

                    let ndist = 0;//solutions[n].dist; es siempre 0 porque el grafo es una matriz
                    let d = 1 + ndist;
                    if (d < dist) {
                        parent = solutions[n];
                        nearest = neighbors[i];
                        dist = d;
                    }
                }
            }
            visited.push(n);
            solutions[nearest] = parent.concat(nearest);
            //solutions[nearest].dist = dist;
            if (dist === Infinity || nearest == this.end)
                break;
        }

        return { "visited": visited, "path": solutions[this.end] };
    }
}