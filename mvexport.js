function meshview() {
    allpoi[section_id] = poi;
    const wnd = window.open("https://meshview.apps.hbp.eu?atlas=" + (args.atlas.startsWith("WHS") ? "WHS_SD_Rat_v4_39um" : "ABA_Mouse_CCFv3_2017_25um"), "MeshView #" + Date.now());
    const color = document.getElementById("ancolor").value.substring(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const message = [];
    for (const section of filmstrip.getmeta()) {
        const pois = allpoi[section.id] || [];
        if (pois.length) {
            const vertices = [
                [-section.w / 10, -section.h / 10, -section.w / 10, -section.h / 10],
                [section.w * 1.1, -section.h / 10, section.w * 1.1, -section.h / 10],
                [-section.w / 10, section.h * 1.1, -section.w / 10, section.h * 1.1],
                [section.w * 1.1, section.h * 1.1, section.w * 1.1, section.h * 1.1]];
            const triangles = [[0, 1, 2], [1, 2, 3]];
            // i<j j*(j-1)/2+i
            const ix = (i, j) => j * (j - 1) / 2 + i;
            const edges = [2, 2, 2, 0, 2, 2];

            if (!args.linear)
                for (const marker of allmarkers[section.id]) {
                    const D = [marker.nx, marker.ny];
                    let found = false;
                    const remove = [];
                    for (let i = 0; i < triangles.length; i++) {
                        const triangle = triangles[i];
                        const A = vertices[triangle[0]];
                        const B = vertices[triangle[1]];
                        const C = vertices[triangle[2]];
                        if (!found && intri(A, B, C, D))
                            found = true;
                        if (incirc(A, B, C, D))
                            remove.unshift(i);
                    }
                    if (found) {
                        for (const i of remove) {
                            const triangle = triangles.splice(i, 1)[0];
                            const A = triangle[0];
                            const B = triangle[1];
                            const C = triangle[2];
                            edges[ix(A, B)]--;
                            edges[ix(A, C)]--;
                            edges[ix(B, C)]--;
                        }
                        const es = [];
                        for (let j = 1; j < vertices.length; j++)
                            for (let i = 0; i < j; i++)
                                if (edges[ix(i, j)] === 1) {
                                    triangles.push([i, j, vertices.length]);
                                    es.push([i, j], [i, vertices.length], [j, vertices.length]);
                                }
                        for (var e of es)
                            edges[ix(e[0], e[1])] = 2; //..
                        vertices.push([marker.nx, marker.ny, marker.x, marker.y]);
                    }
                }

            for (const triangle of triangles) {
                const A = vertices[triangle[0]];
                const B = vertices[triangle[1]];
                const C = vertices[triangle[2]];
                triangle.push(
                        Math.min(A[0], B[0], C[0]), //3
                        Math.max(A[0], B[0], C[0]), //4
                        Math.min(A[1], B[1], C[1]), //5
                        Math.max(A[1], B[1], C[1]), //6
                        inv3x3([//7
                            [B[0] - A[0], B[1] - A[1], 0],
                            [C[0] - A[0], C[1] - A[1], 0],
                            [A[0], A[1], 1]
                        ]));
            }

            const triplets = [];
            for (const poi of pois) {
                const x = poi.x;
                const y = poi.y;
                for (const triangle of triangles)
                    if (x >= triangle[3] && x <= triangle[4] && y >= triangle[5] && y <= triangle[6]) {
                        const uv1 = mult([[x, y, 1]], triangle[7])[0];
                        if (uv1[0] >= 0 && uv1[0] < 1 && uv1[1] >= 0 && uv1[1] < 1 && uv1[0] + uv1[1] <= 1) {
                            const A = vertices[triangle[0]];
                            const B = vertices[triangle[1]];
                            const C = vertices[triangle[2]];
                            const nx = A[2] + (B[2] - A[2]) * uv1[0] + (C[2] - A[2]) * uv1[1];
                            const ny = A[3] + (B[3] - A[3]) * uv1[0] + (C[3] - A[3]) * uv1[1];
                            const x = section.ox + section.ux * nx / section.w + section.vx * ny / section.h;
                            const y = section.oy + section.uy * nx / section.w + section.vy * ny / section.h;
                            const z = section.oz + section.uz * nx / section.w + section.vz * ny / section.h;
                            triplets.push(x, y, z);
                            break;
                        }
                    }
            }
            message.push({name: section.id, r, g, b, triplets});
        }
    }
    onmessage = () => {
        wnd.postMessage(message, "*");
    };

    /*
     * Linear-only
     */
    //allpoi[section_id] = poi;
    //let wnd = window.open("https://meshview.apps.hbp.eu?atlas=" + (args.atlas.startsWith("WHS") ? "WHS_SD_Rat_v4_39um" : "ABA_Mouse_CCFv3_2017_25um"), "MeshView #" + Date.now());
    //let color = document.getElementById("ancolor").value.substring(1);
    //let r = parseInt(color.substring(0, 2), 16);
    //let g = parseInt(color.substring(2, 4), 16);
    //let b = parseInt(color.substring(4, 6), 16);
    //let message = [];
    //for (let section of filmstrip.getmeta()) {
    //    let markers = allpoi[section.id] || [];
    //    if (markers.length) {
    //        let triplets = [];
    //        for (let marker of markers) {
    //            let nx = marker.x / section.w;
    //            let ny = marker.y / section.h;
    //            let x = section.ox + section.ux * nx + section.vx * ny;
    //            let y = section.oy + section.uy * nx + section.vy * ny;
    //            let z = section.oz + section.uz * nx + section.vz * ny;
    //            triplets.push(x, y, z);
    //        }
    //        message.push({name: section.id, r, g, b, triplets});
    //    }
    //}
    //onmessage = () => {
    //    wnd.postMessage(message, "*");
    //};

    /*
     * Very old export winth Copy-Paste coordinate transfer
     */
    //var wnd=window.open("about:blank","MeshView #"+Date.now());
    //var d = wnd.document;
    //d.write("<html><head><title>MeshView export</title><style>textarea{width:100%;height:80%}</style></head><body>");
    //d.write("Please copy the coordinates below into <a href='http://www.nesys.uio.no/MeshGen/MeshView.html?bitlas="
    //        + JSON.parse('{"100000":"ABAMouseHier","200000":"WHSRatV2","300000":"ABAv3-Hier"}')[args.atlas]
    //        + ".bitlas' target='_blank'>MeshView</a>. Viewer needs Adobe Flash.");
    //if (args.atlas === "100000")
    //    d.write("<br>(Hint: \"Basic cell groups and regions\" is the gray wrapper structure to be switched off)");
    //if (args.atlas === "300000")
    //    d.write("<br>(Hint: \"root\" is the gray wrapper structure to be switched off)");
    //d.write("<textarea id='ta'>");
    //d.write("RGB 0 0 1\n");
    //d.write("SCALE 5\n");
    //filmstrip.getmeta().forEach(function (section) {
    //    var markers = allpoi[section.id] || [];
    //    if (markers.length) {
    //        d.write("\n# " + section.name + "\n");
    //        markers.forEach(function (marker) {
    //            var nx = marker.x / section.w;
    //            var ny = marker.y / section.h;
    //            var x = section.ox + section.ux * nx + section.vx * ny;
    //            var y = section.oy + section.uy * nx + section.vy * ny;
    //            var z = section.oz + section.uz * nx + section.vz * ny;
    //            if (args.atlas === "100000") {
    //                y -= 528;
    //                z -= 320;
    //            }
    //            d.write(x.toFixed(0) + " " + y.toFixed(0) + " " + z.toFixed(0) + "\n");
    //        });
    //    }
    //});
    //d.write("</textarea></body></html>");
    //d.close();
}
