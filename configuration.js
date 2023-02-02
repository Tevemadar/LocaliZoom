/*
 * HBP configuration
 */
const locators = {
    SeriesLocator: series_id => series_id,
    DZILocator: () => {
    },
    TileLocator: () => {
    },
    AtlasLocator: atlas_id => atlas_id + ".json",
    AtlasVolumeLocator: atlas_id => atlas_id + ".pack"
};
function transformSeries(series) {
    /*
     * convert extensions to .tif except for one protected bucket:
     */
    if (args.pyramids !== "buckets/img-eff39c41-6eaa-4d3f-a91f-ef936e793606") {
        for (const slice of series.slices) {
            const filename = slice.filename;
            const pos = filename.lastIndexOf(".");
            if (pos >= 0) {
                slice.filename = filename.substring(0, pos) + ".tif";
            }
        }
    }
    /*
     * argument-specific locators
     */
    if (args.pyramids.startsWith("buckets/")) {
        /*
         * pyramids in collab bucket
         */
        locators.DZILocator = section_id =>
                `https://data-proxy.ebrains.eu/api/v1/${args.pyramids}/${section_id}/` +
                    `${section_id.substring(0, section_id.lastIndexOf("."))}.dzi`;
        locators.TileLocator = (section_id, level, x, y, format) =>
                `https://data-proxy.ebrains.eu/api/v1/${args.pyramids}/${section_id}/` +
                    `${section_id.substring(0, section_id.lastIndexOf("."))}_files/${level}/${x}_${y}.${format}`;
    } else {
        /*
         * pyramids in legacy image service container
         */
        locators.DZILocator = section_id =>
                `https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/${args.pyramids}/${section_id}/` +
                    `${section_id.substring(0, section_id.lastIndexOf("."))}.dzi`;
        locators.TileLocator = (section_id, level, x, y, format) =>
                `https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/${args.pyramids}/${section_id}/` +
                    `${section_id.substring(0, section_id.lastIndexOf("."))}_files/${level}/${x}_${y}.${format}`;
    }
}
