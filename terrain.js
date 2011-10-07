/**
 * Generate a square matrix
 * @param {number} size - Width and length of the square.
 * @return {Array.<Array.<int>>} The vertices matrix of the square
 */
function generateMatrix(size) {
    var i, j, matrix;

    matrix = [];
    // number of vertices will be size + 1
    for (i = 0; i <= size; i++) {
        matrix.push([]);
        for (j = 0; j <= size; ++j) {
            matrix[i].push(0);
        }
    };

    return matrix;
}


/**
 * Iterate on the matrix
 * @param {Array.<Array.<int>>} matrix - Matrix to be iterated on.
 */
function iterate(matrix) {
    var current = 0,
        depth;

    depth = Math.log(matrix.length - 1) / Math.log(2);
    while (current++ < depth) {
        diamond(matrix, current);
        square(matrix, current);
    }
}


/**
 * Diamond step of iteration
 * @param {number} depth - Depth of current iteration(starts from 1)
 */
function diamond(matrix, depth) {
    var matSize, numSegs, span, 
        i, j, x, y,
        heights, 
        va, vb, vc, vd, vf, vg, vh, vi,
        avg, offset;

    matSize = matrix.length - 1;
    numSegs = Math.pow(2, depth - 1);
    span = matSize / numSegs;

    // enumerate sub-squares 
    for (i = 0; i < numSegs; ++i) {
        for (j = 0; j < numSegs; ++j) {
            //  (x, y)
            //    \
            //     a---b---c
            //     |   |   |
            //     d---e---f
            //     |   |   |
            //     g---h---i
            // 
            //     \___ ___/
            //         V
            //       span 
            // 
            x = i * span;
            y = j * span;

            va = [x, y];
            vc = [x + span, y];
            ve = [x + span / 2, y + span / 2];
            vg = [x, y + span];
            vi = [x + span, y + span];

            // heights of vertices
            heights = [va, vc, vg, vi].map(function(v) {
                return matrix[v[1]][v[0]];
            });
            
            // average height
            avg = average(heights);

            // random offset
            offset = getH(1, depth);

            // set center height
            matrix[ve[1]][ve[0]] = avg + offset;
        }
    }
}


/**
 * Square step of iteration
 * @param {number} depth - Depth of current iteration(starts from 1)
 */
function square(matrix, depth) {
    var matSize, numSegs, span, 
        i, j, x, y,
        va, vb, vc, vd, vf, vg, vh, vi;

    matSize = matrix.length - 1;
    numSegs = Math.pow(2, depth - 1);
    span = matSize / numSegs;

    // enumerate sub-squares 
    for (i = 0; i < numSegs; ++i) {
        for (j = 0; j < numSegs; ++j) {
            //  (x, y)
            //    \
            //     a---b---c---d---e
            //     | \ | / | \ | / |
            //     f---g---h---i---j
            //     | / | \ | / | \ |
            //     k---l---m---n---o
            //     | \ | / | \ | / |
            //     p---q---r---s---t
            //     | / | \ | / | \ |
            //     u---v---w---x---y
            // 
            //     \___ ___/
            //         V
            //       span 
            // 
            x = i * span;
            y = j * span;

            va = [x, y];
            vb = [x + span / 2, y];
            vc = [x + span, y];
            vf = [x, y + span / 2];
            vg = [x + span / 2, y + span / 2];
            vh = [x + span, y + span / 2];
            vk = [x, y + span];
            vl = [x + span / 2, y + span];
            vm = [x + span, y + span];

            vi = [(x + span / 2 * 3) % matrix.length, y + span / 2]; // right of h
            vj = [(x - span / 2 + matrix.length) % matrix.length, y + span / 2]; // left of f
            vq = [x + span / 2, (y + span / 2 * 3) % matrix.length]; // under l
            vv = [x + span / 2, (y - span / 2 + matrix.length) % matrix.length]; // above b

            squareHelper(matrix, depth, va, vg, vk, vj, vf);
            squareHelper(matrix, depth, va, vv, vc, vg, vb);
            squareHelper(matrix, depth, vc, vi, vm, vg, vh);
            squareHelper(matrix, depth, vk, vg, vm, vq, vl);

        }
    }
}

function squareHelper(matrix, depth, a, b, c, d, t) {
    var heights, avg, offset;

    heights = [a, b, c, d].map(function(v) {
        return matrix[v[1]][v[0]];
    });
    avg = average(heights);
    offset = getH(1, depth);
    matrix[t[1]][t[0]] = avg + offset;
}


/**
 * Get a random offset.
 * @param {number} smoothness - Higher the value, smoother the terrain.
 *      recommened value is 1.
 * @param {number} depth - Depth of current iteration(starts from 1).
 */
function getH(smoothness, depth) {
    var sign, reduce, i;

    sign = Math.random() > 0.5 ? 1 : -1,
    reduce = 1;
    for (i = 1; i < depth; ++i) { 
        reduce *= Math.pow(2, -smoothness);
    }

    return sign * Math.random() * reduce;
}


function average(numbers) {
    var sum = 0;
    numbers.forEach(function(v) {
        sum += v;
    });
    return sum / numbers.length;
}

/**
 * Generate fractal terrain
 * @param {number} size - Size of terrain
 */
function generateTerrain(size) {
    var mat = generateMatrix(Math.pow(2, size));
    iterate(mat);
    return mat;
}
