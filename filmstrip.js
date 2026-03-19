const fs_width = 128;
var filmstrip = {};
(function () {
    var volumeready = false;
    this.start = async function () {
        initvol(await loaders.AtlasVolumeLoader(args.atlas), volumeReady);
    };

    var arry = [];
    this.getmeta = function () {
        return arry;
    };
    var metahack;
    async function volumeReady(event) {
        cover();
        volumeready = true;
        //metahack=event.target.response;//.slices;
        metahack = await loaders.SeriesLoader(args.series);
        await transformSeries(metahack);
        var slices = metahack.slices;
        propagation.propagate(slices);
        let noname = false;
        for (let slice of slices) {
            if (!slice.hasOwnProperty("filename")) {
                noname = true;
                continue;
            }
            arry.push({
                id: slice.filename,
                s: slice.nr,
                w: slice.width,
                h: slice.height,
                ox: slice.anchoring[0],
                oy: slice.anchoring[1],
                oz: slice.anchoring[2],
                ux: slice.anchoring[3],
                uy: slice.anchoring[4],
                uz: slice.anchoring[5],
                vx: slice.anchoring[6],
                vy: slice.anchoring[7],
                vz: slice.anchoring[8],
                icon: null
            });
        }
        if (noname)
            alert("Series contains sections without corresponding image!");

        metaReady(metahack, function () {
            idx = arry.findIndex(section => section.id.includes(args.section));
            if (idx < 0)
                idx = Math.floor(arry.length / 2);
            redraw();
        });
    }
    this.prev = function () {
        if (active && active.previousSibling)
            activate({target: active.previousSibling});
    };
    this.next = function () {
        if (active && active.nextSibling)
            activate({target: active.nextSibling});
    };
    var idx;
    const observer = new IntersectionObserver(loader);
    const iconmap = new Map;
    function redraw() {
        const scroller = document.getElementById("stripscroller");

        for (const item of arry) {
            const div = document.createElement("div");
            div.title = item.id.match(/(.*?)(.tiff?|.png|.jpe?g)?(.dzip?)?$/)[1];
            observer.observe(div);
            item.key = div;
            iconmap.set(div, item);
            div.className = "icon";
            div.onclick = activate;

            const {opaque, overlay, outline, outlinedata} = iconset(item, {width: fs_width});
            item.outline = outline;
            item.outlinedata = outlinedata;

            overlay.className = "icnv";
            outline.className = "icnv";
            div.appendChild(opaque);
            div.appendChild(overlay);
            div.appendChild(outline);
            scroller.appendChild(div);
        }
        filmstrip.fs_ovly();
        filmstrip.fs_outline();
        activate({target: arry[idx].key}, true);
    }

    let active;
    function activate(event, start) {
        const target = event.target;
        if (active === target)
            return;
        if (active)
            active.classList.remove("active");
        active = target;
        active.classList.add("active");
        active.scrollIntoView({
            behavior: start ? "instant" : "smooth",
            block: start ? "center" : "nearest",
            container: "nearest"
        });
        dispatchOuv(iconmap.get(target));
    }

    this.fs_ovly = function (event) {
        const opacity = document.getElementById("fs_alpha").valueAsNumber / 100;
        const o1 = opacity === 1 ? 0 : opacity;
        const o2 = opacity === 1 ? 1 : 0;
        for (const icon of document.getElementsByClassName("icon")) {
            icon.children[1].style.opacity = o1;
            icon.children[2].style.opacity = o2;
        }
    };

    this.fs_outline = function (event) {
        const color = document.getElementById("outline").value;
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        for (const item of arry) {
            const {outline, outlinedata} = item;
            const data = outlinedata.data;
            const len = data.length;
            for (let i = 0; i < len; i += 4)
                if (data[i + 3] === 255) {
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                }
            outline.getContext("2d").putImageData(outlinedata, 0, 0);
        }
    };

    function loader(entries) {
        for (const entry of entries)
            if (entry.isIntersecting) {
                const div = entry.target;
                observer.unobserve(div);
                const image = iconmap.get(div);
                loaders.DZILoader(image.id).then(async dzi => {
                    var doc = new DOMParser().parseFromString(dzi, "text/xml").documentElement;
                    var tilesize = parseInt(doc.getAttribute("TileSize"));
                    var size = doc.getElementsByTagName("Size").item(0);
                    var width = parseInt(size.getAttribute("Width"));
                    var height = parseInt(size.getAttribute("Height"));
                    var w = width, h = height, maxlevel = 0;
                    while (w > 1 || h > 1) {
                        w = (w + 1) >> 1;
                        h = (h + 1) >> 1;
                        maxlevel++;
                    }
                    var level = 0;
                    while (width >= tilesize || height >= tilesize || width >= fs_width * 2) {
                        level++;
                        width = (width + 1) >> 1;
                        height = (height + 1) >> 1;
                    }
                    const icon = await loaders.TileLoader(image.id, maxlevel - level, 0, 0, doc.getAttribute("Format"));
                    const cnv = div.firstElementChild;
                    div.firstElementChild.getContext("2d").drawImage(icon, 0, 0, cnv.width, cnv.height);
                });
            }
    }

    this.resize = () => active && active.scrollIntoView({behavior: "smooth", block: "nearest", container: "nearest"});
}).apply(filmstrip);
