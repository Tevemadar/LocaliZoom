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
            activate({target: active.previousSibling.firstElementChild});
    };
    this.next = function () {
        if (active && active.nextSibling)
            activate({target: active.nextSibling.firstElementChild});
    };
    var idx;
    const observer = new IntersectionObserver(loader);
    const iconmap = new Map;
    function redraw() {
        const scroller = document.getElementById("stripscroller");
        const opacity = document.getElementById("fs_alpha").valueAsNumber / 100;

        for (const item of arry) {
            const div = document.createElement("div");
            observer.observe(div);
            item.key = div;
            iconmap.set(div, item);
            div.className = "icon";
            const icon = document.createElement("canvas");
            const overlay = document.createElement("canvas");
            overlay.onclick = activate;
            overlay.style.opacity = opacity;
            overlay.className = "icnv";
            const w = icon.width = overlay.width = 128;
            const h = icon.height = overlay.height = 128 * item.h / item.w;
            div.appendChild(icon);
            div.appendChild(overlay);
            scroller.appendChild(div);
            const ovly = slice(item);
            for (const cnv of [icon, overlay]) {
                const ctx = cnv.getContext("2d");
                ctx.drawImage(ovly, 0, 0, w, h);
            }
        }
        activate({target: arry[idx].key.firstElementChild});
    }

    let active;
    function activate(event) {
        const target = event.target.parentElement;
        if (active === target)
            return;
        if (active)
            active.classList.remove("active");
        active = target;
        active.classList.add("active");
        active.scrollIntoView({block: "center"});
        dispatchOuv(iconmap.get(target));
    }

    this.fs_ovly = function (event) {
        const opacity = event.target.valueAsNumber / 100;
        for (const cnv of document.getElementsByClassName("icnv")) {
            cnv.style.opacity = opacity;
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
                    while (width >= tilesize || height >= tilesize) {
                        level++;
                        width = (width + 1) >> 1;
                        height = (height + 1) >> 1;
                    }
                    const icon = await loaders.TileLoader(image.id, maxlevel - level, 0, 0, doc.getAttribute("Format"));
                    div.firstElementChild.getContext("2d").drawImage(icon, 0, 0, 128, height * 128 / width);
                });
            }
    }

    this.resize = () => active && active.scrollIntoView({block: "center"});
}).apply(filmstrip);
