var filmstrip={};

(function(){
    var cache=new LRUCache(20);
    
    var canvaswidth=0;
    var canvasheight=0;
    this.setwidth=function(width){canvaswidth=width;redraw();return width;};
    this.setheight=function(height){canvasheight=height;redraw();return height;};

    var volumeready=false;
    this.start=function(){
        initvol(locators.AtlasVolumeLocator(args.atlas),volumeReady);
    };
    function volumeReady(event){
        volumeready=true;
        var xhr=new XMLHttpRequest();
        xhr.open("GET",locators.SeriesLocator(args.series));
        xhr.responseType="json";
        xhr.onload=seriesReady;
        xhr.send();
    }
    
    var arry=[];
    this.getmeta=function(){return arry;};
    var metahack;
    function seriesReady(event){
        metahack=event.target.response;//.slices;
        var slices=metahack.slices;
        propagation.propagate(slices);
        let noname=false;
        for(let slice of slices){
            if(!slice.hasOwnProperty("filename")){
                noname=true;
                continue;
            }
            let id=slice.filename;
            if(args.pyramids!=="buckets/img-eff39c41-6eaa-4d3f-a91f-ef936e793606"){
                let pos=id.lastIndexOf(".");
                if(pos>=0)
                    id=id.substring(0,pos)+".tif";
            }
            arry.push({
                id:id,
                s:slice.nr,
                w:slice.width,
                h:slice.height,
                ox:slice.anchoring[0],
                oy:slice.anchoring[1],
                oz:slice.anchoring[2],
                ux:slice.anchoring[3],
                uy:slice.anchoring[4],
                uz:slice.anchoring[5],
                vx:slice.anchoring[6],
                vy:slice.anchoring[7],
                vz:slice.anchoring[8],
                icon:null
            });
        }
        if(noname)alert("Series contains sections without corresponding image!");

        metaReady(metahack,function(){
            idx=Math.floor(arry.length/2);
            pos=Math.max(0,idx*160-canvaswidth/2+72);
            dispatchOuv(arry[idx]);

            redraw();
//            loadloop=0;
//            load();
        });
    };
    this.prev=function(){
        if(idx>0){
            idx--;
            pos=Math.max(0,idx*160-canvaswidth/2+72);
            dispatchOuv(arry[idx]);
            redraw();
        }
    };
    this.next=function(){
        if(idx<arry.length-1){
            idx++;
            pos=Math.max(0,idx*160-canvaswidth/2+72);
            dispatchOuv(arry[idx]);
            redraw();
        }
    };
//    var loadloop;
//    function load(){
//        if(loadloop<arry.length){
//            var img=document.createElement("img");
//            arry[loadloop].img=img;
//            img.onload=function(){
//                if((loadloop>=start)&&(loadloop<=end))
//                    redraw();
//                loadloop++;
//                load();
//            };
//            img.src=locators.ThumbLocator(arry[loadloop].id);
//        }
//    }
    var pos=0;
    var start=0;
    var end=-1;
    var alpha=0.3;
    this.setalpha=function(newalpha){alpha=newalpha;};
    var idx;
    function redraw(){
        if(!volumeready)return;
        start=Math.floor((pos-128)/160);
        if(start<0)start=0;
        end=Math.floor((pos+(canvaswidth-20))/160);
        if(end>=arry.length)end=arry.length-1;
        var ctx=document.getElementById("scroller").getContext("2d");
        ctx.globalAlpha=1;
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(0,0,canvaswidth,canvasheight);
        for(var x=start;x<=end;x++){
            let item=arry[x];
            var id=item.id;
            var ovly=cache.get(id);
            if(!ovly)ovly=slice(item);
            cache.put(id,ovly);
            ctx.globalAlpha=1;
            if(idx===x){
                ctx.fillStyle="#00FF00";
                ctx.fillRect(x*160-pos+20-10,20,128+10+10,128);
            }
            if(item.icon===null){
                item.icon=new XMLHttpRequest();
                item.icon.open("GET",locators.DZILocator(item.id));
                item.icon.onload=function(event){
                    var doc=new DOMParser().parseFromString(event.target.responseText,"text/xml").documentElement;
                    var tilesize=parseInt(doc.getAttribute("TileSize"));
                    var size=doc.getElementsByTagName("Size").item(0);
                    var width=parseInt(size.getAttribute("Width"));
                    var height=parseInt(size.getAttribute("Height"));
                    var w=width,h=height,maxlevel=0;
                    while(w>1 || h>1){
                        w=(w+1)>>1;
                        h=(h+1)>>1;
                        maxlevel++;
                    }
//                    console.log(tilesize,width,height,item.id);
                    var level=0;
                    while(width>=tilesize || height>=tilesize){
                        level++;
                        width=(width+1)>>1;
                        height=(height+1)>>1;
                    }
                    var img=document.createElement("img");
                    img.onload=function(event){
                        item.icon=img;
                        redraw();
//                        console.log(""+item.icon);
                    };
                    img.src=locators.TileLocator(item.id,maxlevel-level,0,0,doc.getAttribute("Format"));
                };
                item.icon.send();
            }
            if(item.icon instanceof HTMLImageElement){
                if(item.icon.width>=item.icon.height){
                    ctx.drawImage(item.icon,x*160-pos+20,20,128,128*item.icon.height/item.icon.width);
                    ctx.globalAlpha=alpha;
                    ctx.drawImage(ovly,x*160-pos+20,20,128,128*item.icon.height/item.icon.width);
                }
                else{
                    ctx.drawImage(item.icon,x*160-pos+20,20,128*item.icon.width/item.icon.height,128);
                    ctx.globalAlpha=alpha;
                    ctx.drawImage(ovly,x*160-pos+20,20,128*item.icon.width/item.icon.height,128);
                }
            }else{
                if(ovly.width>=ovly.height)
                    ctx.drawImage(ovly,x*160-pos+20,20,128,128*ovly.height/ovly.width);
                else
                    ctx.drawImage(ovly,x*160-pos+20,20,128*ovly.width/ovly.height,128);
            }
//            var img=item.img;
//            if(img){
//                ctx.drawImage(img,x*160-pos+20,20);
//                ctx.globalAlpha=alpha;
//                ctx.drawImage(ovly,x*160-pos+20,20,img.width,img.height);
//            }
//            else
//                ctx.drawImage(ovly,x*160-pos+20,20,128,128);
        }
        ctx.clearRect(0,0,20,128+20);
        ctx.lineStyle="black";
        ctx.fillStyle="#0000FF";
        ctx.globalAlpha=1;
        ctx.strokeRect(0,Math.round(20+118*alpha)+0.5,20,10);
        ctx.clearRect(0,0,canvaswidth,20);
        ctx.strokeRect(20,0,canvaswidth-20,20);
        var len=arry.length*160-34;
        ctx.fillRect(20+pos*(canvaswidth-20)/len,0,(canvaswidth-20)*(canvaswidth-20)/len,20);
    }
    
    this.mwheel=function(event){
        if(event.offsetX<20){
            alpha+=event.deltaY>0?0.05:-0.05;
            alpha=Math.max(0,Math.min(1,alpha));
        }else{
            pos+=event.deltaY<0?100:-100;
            pos=Math.max(0,Math.min(pos,arry.length*160-canvaswidth-34+20));
        }
        redraw();
    };
    this.mclick=function(event){
        if(event.offsetX<20){
            if(event.offsetY<20){
                alpha=alpha===0?1:0;
            } else {
                alpha=(event.offsetY-20)/118;
            }
            redraw();
            return;
        }
        if(event.offsetY<20){
            var len=arry.length*160-34;
            pos=(event.offsetX-20-(canvaswidth-20)*(canvaswidth-20)/len/2)*len/(canvaswidth-20);
            pos=Math.max(0,Math.min(pos,arry.length*160-canvaswidth-34+20));
            redraw();
            return;
        }
        idx=Math.floor((pos+event.offsetX-20+(160-128)/2)/160);
        dispatchOuv(arry[idx]);
        redraw();
    };
}).apply(filmstrip);
