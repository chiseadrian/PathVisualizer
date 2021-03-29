const WIDTH = 75;
const HEIGHT = 29;
mousePressed = false;
newStartPosition = false;
newEndPosition = false;
lastAlgorithm = "";
startId = "13-10";
endId = "13-60";
grid = new Map();

window.onload = function () {
    printTable();
}

function printTable() {
    for (i = 0; i < HEIGHT; i++) {
        let tr = document.createElement('tr');
        for (j = 0; j < WIDTH; j++) {
            let td = document.createElement('td');
            td.id = i + "-" + j;
            (td.id == startId || td.id == endId) ? td.className = "point" : td.className = "unvisited";
            td.onmousedown = function (event) { mouseDown(event) };
            td.onmouseup = function (event) { mouseUp(event) };
            tr.appendChild(td);
        }
        document.getElementById("content").appendChild(tr);
    }
}
function onMouseMove(e) {
    cell = document.elementFromPoint(e.clientX, e.clientY);
    if (mousePressed) {
        if (newStartPosition || newEndPosition) {
            document.getElementById(cell.id).classList.add("onMovePoint");
            document.getElementById(cell.id).classList.remove('onMovePoint');
        }
        else if (cell.id != startId && cell.id != endId) {
            document.getElementById(cell.id).className = "wall";
        }
    }
}
function mouseDown(e) {
    e.preventDefault(); //cancela el drag-and-drop del navegador por defecto
    mousePressed = true;
    auxEventUpDown(e, "down");
}
function mouseUp(e) {
    mousePressed = false;
    auxEventUpDown(e, "up");
}
function auxEventUpDown(e, event) {
    cell = document.elementFromPoint(e.clientX, e.clientY);
    if (event == "down") {
        document.getElementById(cell.id).className = "unvisited";
        if (cell.id == startId) newStartPosition = true;
        else if (cell.id == endId) newEndPosition = true;
    } else if (event == "up") {
        if (newStartPosition) {
            newStartPosition = false;
            startId = cell.id;
            document.getElementById(startId).className = "point";
        }
        else if (newEndPosition) {
            newEndPosition = false;
            endId = cell.id;
            document.getElementById(endId).className = "point";
        }
    }
}
function getGrid() {
    let grid = new Map();
    for (i = 0; i < HEIGHT; i++) {
        for (j = 0; j < WIDTH; j++) {
            id = i + "-" + j;
            if (!isWall(id)) {
                grid.set(id, getNeighbors(id));
            }
        }
    }

    return grid;
}
function isWall(id) {
    return (document.getElementById(id).className == "wall") ? true : false;
}
function getNeighbors(id) {
    let neighbors = [];
    let idAux = id.split("-").map(Number);
    let neighborsIdAux = [
        (idAux[0] + 1) + "-" + idAux[1],
        idAux[0] + "-" + (idAux[1] + 1),
        (idAux[0] - 1) + "-" + idAux[1],
        idAux[0] + "-" + (idAux[1] - 1),
    ]
    if (idAux[0] + 1 < HEIGHT && !isWall(neighborsIdAux[0])) neighbors.push(neighborsIdAux[0]);
    if (idAux[1] + 1 < WIDTH && !isWall(neighborsIdAux[1])) neighbors.push(neighborsIdAux[1]);
    if (idAux[0] - 1 >= 0 && !isWall(neighborsIdAux[2])) neighbors.push(neighborsIdAux[2]);
    if (idAux[1] - 1 >= 0 && !isWall(neighborsIdAux[3])) neighbors.push(neighborsIdAux[3]);

    return neighbors;
}
function visualize() {
    if (isRunning())
        location.reload();

    showButton("stop");
    grid = getGrid();
    currentAlgorithm = document.getElementById("algorithm-selected").value;
    if (currentAlgorithm != lastAlgorithm)
        clearBoard("path");

    switch (currentAlgorithm) {
        case "bfs":
            bfs = new BFS(grid, startId, endId);
            drawAll(bfs.solve());
            break;
        case "dijkstra":
            dijkstra = new Dijkstra(grid, startId, endId);
            drawAll(dijkstra.solve());
            break;
        case "a":
            astar = new AStar(grid, startId, endId);
            drawAll(astar.solve());
            break;
        default:
            alert("Select an algorithm !!!");
            showButton("visualize");
            break;
    }
}
async function generateMaze() {
    disableWhenMaze();
    clearBoard("all");
    maze = new Maze(14, 37);
    await maze.draw();
    showButton("visualize");
}
function clearBoard(type) {
    for (i = 0; i < HEIGHT; i++) {
        for (j = 0; j < WIDTH; j++) {
            cell = document.getElementById(i + "-" + j);
            if (cell.className != 'point' && cell.className != 'unvisited') {
                if (type == "path" && cell.className != "wall")
                    cell.className = "unvisited";
                else if (type == "all")
                    cell.className = "unvisited";
            }
        }
    }
}
async function drawAll(data) {
    await draw(data.visited, "visited");
    await draw(data.path, "path");
    showButton("visualize", "Path");
}
function draw(list, type) {
    return new Promise(resolve => {
        let time = 1;
        if (type === "path") time = 20;
        function timeout() {
            setTimeout(function () {
                if (list.length == 0)
                    resolve("fin");
                else {
                    let cell = document.getElementById(list.shift());
                    if (cell.className != "point")
                        cell.className = type;
                    timeout();
                }
            }, time);
        }
        timeout();
    });
}