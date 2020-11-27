function derle(data,method){
    let word=method>1;
    let result=word?new Uint16Array(data.length):new Uint8Array(data.length);
    let dread,cread;
    switch(method){
        case 1:
            dread=read8;
            cread=read15;
            break;
        case 2:
            dread=cread=read15;
            break;
        case 3:
            dread=read15;
            cread=readN;
            break;
        default:
            throw "Ehm, please implement "+method;
    }
    let writepos = 0;
    let readpos=0;
    while(readpos<data.length){
        let d=dread();
        write(d);
        let c=cread();
        while(c-->0)
            write(d);
    }
    resize(writepos);
    return result;
    
    function read8(){
        return data[readpos++];
    }
    function read15(){
        let d=data[readpos++];
        if(d>127)
            d=((d-128)<<8)+data[readpos++];
        return d;
    }
    function readN(){
        throw "Ehm, please implement readN";
    }
    function write(d) {
        if (writepos >= result.length)
            resize(result.length * 2);
        result[writepos++] = d;
    }
    function resize(len) {
        if(result.length===len)
            return;
        let realloc=word?new Uint16Array(len):new Uint8Array(len);
        len=Math.min(len,result.length);
        for(let i=0;i<len;i++)
            realloc[i]=result[i];
        result = realloc;
    }
}
