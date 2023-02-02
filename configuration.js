// CSCS
const locators = {
    SeriesLocator: function (series_id) {
        return series_id;
    },
    DZILocator: args.pyramids.startsWith("buckets/") ?
            function (section_id) {
                return "https://data-proxy.ebrains.eu/api/v1/public/" +
                        args.pyramids + "/" +
                        section_id + "/" +
                        section_id.substring(0, section_id.lastIndexOf(".")) + ".dzi";//(location.search.includes("&xml")?".xml":".dzi");
            } :
            function (section_id) {
                return "https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/" +
                        args.pyramids + "/" +
                        section_id + "/" +
                        section_id.substring(0, section_id.lastIndexOf(".")) + ".dzi";//(location.search.includes("&xml")?".xml":".dzi");
            },
    TileLocator: args.pyramids.startsWith("buckets/") ?
            function (section_id, level, x, y, format) {
                return "https://data-proxy.ebrains.eu/api/v1/public/" +
                        args.pyramids + "/" +
                        section_id + "/" +
                        section_id.substring(0, section_id.lastIndexOf(".")) + "_files/" +
                        level + "/" + x + "_" + y + "." + format;
            } :
            function (section_id, level, x, y, format) {
                return "https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/" +
                        args.pyramids + "/" +
                        section_id + "/" +
                        section_id.substring(0, section_id.lastIndexOf(".")) + "_files/" +
                        level + "/" + x + "_" + y + "." + format;
            },
    AtlasLocator: function (atlas_id) {
        return atlas_id + ".json";
    },
    AtlasVolumeLocator: function (atlas_id) {
        return atlas_id + ".pack";
    }
};
function transformSeries(series) {
}
