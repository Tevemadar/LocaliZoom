function mult(a, b) {
    var ah = a.length;
    var aw = a[0].length;
    var bh = b.length;
    var bw = b[0].length;
    if (aw !== bh)
        return [["nope"]];
    var res = [];
    for (var y = 0; y < ah; y++) {
        var row = [];
        for (var x = 0; x < bw; x++) {
            var sum = 0;
            for (var i = 0; i < aw; i++)
                sum += a[y][i] * b[i][x];
            row.push(sum);
        }
        res.push(row);
    }
    return res;
}

function inv3x3(m) {
    if (m.length !== 3)
        return[["nope"]];
    for (var i = 0; i < 3; i++)
        if (m[i].length !== 3)
            return[["nope"]];

    var det = m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    if (det === 0)
        return[["nope"]];
    var invdet = 1 / det;

    return [[(m[1][1] * m[2][2] - m[2][1] * m[1][2]) * invdet,
            (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invdet,
            (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invdet],
        [(m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invdet,
            (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invdet,
            (m[1][0] * m[0][2] - m[0][0] * m[1][2]) * invdet],
        [(m[1][0] * m[2][1] - m[2][0] * m[1][1]) * invdet,
            (m[2][0] * m[0][1] - m[0][0] * m[2][1]) * invdet,
            (m[0][0] * m[1][1] - m[1][0] * m[0][1]) * invdet]];
}

function intri(A, B, C, D) {
    var decomp = inv3x3([
        [B[0] - A[0], B[1] - A[1], 0],
        [C[0] - A[0], C[1] - A[1], 0],
        [A[0], A[1], 1]
    ]);
    var uv1 = mult([[D[0], D[1], 1]], decomp)[0];
    return !(uv1[0] < 0 || uv1[0] > 1 || uv1[1] < 0 || uv1[1] > 1 || uv1[0] + uv1[1] > 1) && uv1;
}

function d2(A, B) {
    return (A[0] - B[0]) * (A[0] - B[0]) + (A[1] - B[1]) * (A[1] - B[1]);
}

function incirc(A, B, C, D) {
    var a2 = d2(B, C);
    var b2 = d2(A, C);
    var c2 = d2(A, B);
    var fa = a2 * (b2 + c2 - a2);
    var fb = b2 * (c2 + a2 - b2);
    var fc = c2 * (a2 + b2 - c2);
    var den = fa + fb + fc;
    var Mden = [fa * A[0] + fb * B[0] + fc * C[0], fa * A[1] + fb * B[1] + fc * C[1]];
    var r2den = d2([A[0] * den, A[1] * den], Mden);
    return d2([D[0] * den, D[1] * den], Mden) < r2den;
}
