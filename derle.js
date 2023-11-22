const blobshift = 29;
const blobmax = 1 << 29;
const blobmask = blobmax - 1;
function derle(data, method, size) {
    let word = method > 1;
    let result = [];
    while (size) {
        const step = Math.min(size, blobmax);
        result.push(word ? new Uint16Array(step) : new Uint8Array(step));
        size -= step;
    }
    let dread, cread;
    switch (method) {
        case 1:
            dread = read8;
            cread = read15;
            break;
        case 2:
            dread = cread = read15;
            break;
        case 3:
            dread = read15;
            cread = readN;
            break;
        default:
            throw "Ehm, please implement " + method;
    }
    const it = result.values();
    let blob = it.next().value;
    let writepos = 0;
    let readpos = 0;
    while (readpos < data.length) {
//        let d = dread();
//        write(d);
//        let c = cread();
//        while (c-- > 0)
//            write(d);
        let d = dread(),
            c = cread() + 1;
        if (writepos + c <= blob.length) {
            blob.fill(d, writepos, writepos + c);
            writepos += c;
        } else {
            blob.fill(d, writepos, blob.length);
            writepos = writepos + c - blob.length;
            blob = it.next().value;
            blob.fill(d, 0, writepos);
        }
    }
//    resize(writepos);
    return result;

    function read8() {
        return data[readpos++];
    }
    function read15() {
        let d = data[readpos++];
        if (d > 127)
            d = ((d - 128) << 8) + data[readpos++];
        return d;
    }
    function readN() {
        throw "Ehm, please implement readN";
    }
//    function write(d) {
//        if (writepos >= result.length)
//            resize(result.length * 2);
//        result[writepos++] = d;
//    }
//    function resize(len) {
//        if (result.length === len)
//            return;
//        let realloc = word ? new Uint16Array(len) : new Uint8Array(len);
//        len = Math.min(len, result.length);
//        for (let i = 0; i < len; i++)
//            realloc[i] = result[i];
//        result = realloc;
//    }
}
