class Maze {
    constructor(w, h) {
        this.w = (isNaN(w) || w < 5 || w > 999 ? 20 : w);
        this.h = (isNaN(h) || h < 5 || h > 999 ? 20 : h);
        this.map = new Array();
        for (var mh = 0; mh < h; ++mh) {
            this.map[mh] = new Array();
            for (var mw = 0; mw < w; ++mw) {
                this.map[mh][mw] = { 'n': 0, 's': 0, 'e': 0, 'w': 0, 'v': 0 };
            }
        }
        this.dirs = ['n', 's', 'e', 'w'];
        this.modDir = {
            'n': { y: -1, x: 0, o: 's' },
            's': { y: 1, x: 0, o: 'n' },
            'e': { y: 0, x: -1, o: 'w' },
            'w': { y: 0, x: 1, o: 'e' }
        };
        this.explore(0, 0);
    }

    explore(ex, ey) {
        this.dirs = this.sortRand(this.dirs);
        for (let d in this.dirs) {
            var nx = ex + this.modDir[this.dirs[d]].x;
            var ny = ey + this.modDir[this.dirs[d]].y;
            if (nx >= 0 && nx < this.w && ny >= 0 && ny < this.h && this.map[ny][nx].v == 0) {
                this.map[ey][ex][this.dirs[d]] = 1;
                this.map[ey][ex].v = 1;
                this.map[ny][nx][this.modDir[this.dirs[d]].o] = 1;
                this.explore(nx, ny);
            }
        }
    }

    toGrid() {
        var grid = new Array();
        for (var mh = 0; mh < (this.h * 2 + 1); ++mh) {
            grid[mh] = new Array();
            for (var mw = 0; mw < (this.w * 2 + 1); ++mw) {
                grid[mh][mw] = 0;
            }
        }

        for (var y = 0; y < this.h; ++y) {
            var py = (y * 2) + 1;
            for (var x = 0; x < this.w; ++x) {
                var px = (x * 2) + 1;
                if (this.map[y][x].v == 1)
                    grid[py][px] = 1;
                for (let d in this.dirs) {
                    if (this.map[y][x][this.dirs[d]] == 1)
                        grid[(py + this.modDir[this.dirs[d]].y)][(px + this.modDir[this.dirs[d]].x)] = 1;
                }
            }
        }

        return grid;
    }

    sortRand(a) {
        var out = new Array();
        var l = a.length;

        for (x in a) {
            do {
                var p = Math.floor(Math.random() * (l * 1000)) % l;
            } while (typeof out[p] != 'undefined');

            out[p] = a[x];
        }

        return out;
    }

    draw() {
        grid = this.toGrid();
        return new Promise(resolve => {
            function timeout(pos) {
                setTimeout(function () {
                    if (pos == 29)
                        resolve("fin");
                    else {
                        for (var j = 0; j < 75; j++) {
                            let cell = document.getElementById(pos + "-" + j);
                            if (this.grid[j][pos] == 0 && cell.className != 'point')
                                cell.className = "wall";
                        }
                        timeout(pos + 1);
                    }
                }, 50);
            }
            timeout(0);
        });
    }

}

