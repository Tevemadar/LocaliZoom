/**
 * Demo configuration running from GitHub pages, using remote data
 * 
 * URL parameters are stored in <code>args</code>:<br>
 * * <code>atlas</code>=WHS_SD_Rat_v4_39um<br>
 * * <code>series</code>=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/visualign.json<br>
 * * <code>pyramids</code>=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom
 * @type Object
 */

/**
 * Do whatever transformation on the series descriptor to make the work of various locators easier.<br>
 * This demo strips filenames from their extension, this makes DZILocator and
 * TileLocator very simple to implement
 * @param {type} series
 */
async function transformSeries(series) {
    for (const slice of series.slices) {
        slice.filename = slice.filename.substring(0, slice.filename.lastIndexOf("."));
    }
    /*
     * Small hack: the demo series consists of dark images, overlay colors are set to light here.
     * This could be an URL parameter too, maybe it becomes one in the future.
     */
    document.getElementById("outline").value="#FFFFFF";
    document.getElementById("ancolor").value="#00FFFF";
    document.getElementById("nlcolor").value="#00FFFF";
}

const locators = {
    /**
     * Provide the link of an actual QuickNII/VisuAlign JSON.
     * <br>
     * This demo simply passes the complete URL, no transformation is done
     * @param {string} series_id <code>series</code> URL parameter
     * @returns {string} 
     */
    SeriesLocator: async series_id => fetch(series_id).then(response => response.json()),
    /**
     * Provide the link of an actual DZI descriptor.
     * <br>
     * This demo uses the <code>pyramids</code> parameter and also makes a shortcut via
     * assuming that pyramids reside in a <code>section_id</code>.tif folder. Original
     * extension is removed by <code>transformSeries</code> below.
     * @param {string} section_id <code>filename</code> field of a section
     * @returns {string}
     */
    DZILocator: async section_id => fetch(`${args.pyramids}/${section_id}.tif/${section_id}.dzi`).then(response => response.text()),
    /**
     * Provide the link of an actual image tile.
     * <br>
     * This demo uses the <code>pyramids</code> parameter and also makes a shortcut via
     * assuming that pyramids reside in a <code>section_id</code>.tif folder. Original
     * extension is removed by <code>transformSeries</code> below.
     * @param {string} section_id <code>filename</code> field of a section
     * @param {type} level pyramid level
     * @param {type} x tile coordinates
     * @param {type} y tile coordinates
     * @param {type} format <code>Format</code> field (from the DZI descriptor, usually "png" or "jpg")
     * @returns {string}
     */
    TileLocator: async (section_id, level, x, y, format) => {
        const img = document.createElement("img");
        await new Promise(resolve => {
            img.onload = resolve;
            img.src = `${args.pyramids}/${section_id}.tif/${section_id}_files/${level}/${x}_${y}.${format}`;
        });
        return img;
    },
    /**
     * Provide the link of the atlas descriptor, atlas data is often just next to LocaliZoom,
     * and appending a .json extension is enough
     * @param {type} atlas_id <code>atlas</code> URL parameter
     * @returns {string}
     */
    AtlasLocator: async atlas_id => fetch(atlas_id + ".json").then(response => response.json()),
    /**
     * Provide the link of the atlas descriptor, atlas data is often just next to LocaliZoom,
     * and appending a .pack extension is enough
     * @param {type} atlas_id <code>atlas</code> URL parameter
     * @returns {string}
     */
    AtlasVolumeLocator: async atlas_id => fetch(atlas_id + ".pack").then(response => response.arrayBuffer())
};
