class BFS {
    constructor(grid, start, end) {
        this.grid = grid;
        this.start = start;
        this.end = end;
    }

    solve() {
        let queue = [];
        let prev = new Map();
        let ok = false;
        queue.push(this.start);

        let visited = [];
        while (queue.length > 0 && !ok) {
            let cell = queue.shift(); //borra primer item de la lista y se lo asigna a la variable "cell"
            let neighbors = this.grid.get(cell);

            for (i = 0; i < neighbors.length; i++) {
                try {
                    let next = neighbors[i];
                    let nextCell = document.getElementById(next);
                    if (nextCell.className == "unvisited" || nextCell.className == "point") {
                        queue.push(next);
                        prev.set(next, cell);
                        if (nextCell.className != "point") {
                            nextCell.className = "aux";
                            visited.push(next);
                        }
                        if (next == this.end)
                            ok = true;
                    }
                } catch (error) { console.log(error); }
            }
        }
        var path = [];
        if (prev.size > 0 && ok)
            for (i = this.end; i != this.start; i = prev.get(i))
                path.push(i);

        return { "visited": visited, "path": path };
    }
}