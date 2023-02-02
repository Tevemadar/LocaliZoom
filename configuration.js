
// invocation:
//     filmstripzoom.html?atlas=<atlas_id>&series=<series_id>
//     [filmstripzoom.html?atlas=<atlas_id>&preview=<atlas_preview_id>&series=<series_id>]
//
// example:
//     filmstripzoom.html?atlas=WHS_Rat_v2.xml&series=R602-33611.xml
//     [filmstripzoom.html?atlas=WHS_Rat_v2.xml&preview=WHS_Rat_v2.xml.png&series=R602-33611.xml]
//
// configuration of URL-s appear in the seven locator functions:
// 
// 3 of them are new compared to LocaliZoom
// 
//     locators.SeriesLocator:function(series_id)
//         receives series identifier
//         returns HTTP GET-able URL for downloading series metadata (N3-compatible xml)
//         
//     locators.ThumbLocator:function(section_id)
//         receives section identifier
//         returns URI to be used as src attribute of an image object
//         
//     locators.AtlasPreviewLocator:function(atlas_id)
//         receives atlas identifier
//         returns URI to be used as src attribute of an image object
// 
// 4 of them are identical to LocaliZoom
// 
//     locators.AtlasLocator(atlas_id)
//         receives atlas identifier
//         returns HTTP GET-able URL for downloading the AligNII/ViiNII-compatible atlas-descriptor (xml)
//
//     locators.RLELocator(nifti_id,ox,oy,oz,ux,uy,uz,vx,vy,vz)
//         receives nifti identifier (from atlas-descriptor) and anchor parameters
//         returns HTTP GET-able URL for downloading RLE-compressed atlas slice
//
//     locators.DZILocator(section_id)
//         receives section identifier
//         returns HTTP GET-able URL for downloading DZI descriptor (xml)
//
//     locators.TileLocator(section_id,level,x,y,format)
//         receives section identifier, level-x-y pyramidal selectors and tile format (from DZI descriptor)
//         returns URI to be used as src attribute of an image object

// locators for Navigator. Presumably correct in Navigator3 context
//            var locators={
//                SeriesLocator:function(series_id){return "/navigator/feeder/metadata/?blockId="+series_id;},
//                ThumbLocator:function(section_id){return "/navigator/feeder/thumbnail/?id="+section_id;},
//                AtlasPreviewLocator:function(atlas_id){return "/navigator/filmstripzoom/"+atlas_id;},
//
//                AtlasLocator:function(atlas_id){return "/navigator/feeder/original/?id="+atlas_id;},
//                RLELocator:function(nifti_id,ox,oy,oz,ux,uy,uz,vx,vy,vz){
//                    return "/navigator/feeder/rleslice/?id="+nifti_id
//                            +"&ox="+ox+"&oy="+oy+"&oz="+oz
//                            +"&ux="+ux+"&uy="+uy+"&uz="+uz
//                            +"&vx="+vx+"&vy="+vy+"&vz="+vz;
//                },
//                DZILocator:function(section_id){return "/navigator/feeder/openzoom/?id="+section_id;},
//                TileLocator:function(section_id,level,x,y,format){
//                    return "/navigator/feeder/openzoom/tile/?id="+section_id+"&level="+level+"&column="+x+"&row="+y+"&format="+format;
//                }
//            };

//            var locators={
//                SeriesLocator:function(series_id){return series_id;},
//                ThumbLocator:function(section_id){return "GetThumb.php?id="+section_id;},
//                AtlasPreviewLocator:function(atlas_id){return atlas_id+".png";},
//
//                AtlasLocator:function(atlas_id){return atlas_id+".xml";},
//                RLELocator:function(nifti_id,ox,oy,oz,ux,uy,uz,vx,vy,vz){
//                    return "GetRLE.php?nifti="+nifti_id
//                            +"&ox="+ox+"&oy="+oy+"&oz="+oz
//                            +"&ux="+ux+"&uy="+uy+"&uz="+uz
//                            +"&vx="+vx+"&vy="+vy+"&vz="+vz;
//                },
//                DZILocator:function(section_id){return "GetXML.php?id="+section_id;},
//                TileLocator:function(section_id,level,x,y,format){
//                    return "GetPNG.php?id="+section_id+"&level="+level+"&x="+x+"&y="+y+"&format="+format;
//                }
//            };

//            // Proxy
//            var locators={
//                SeriesLocator:function(series_id){return "fprox.php?feeder=metadata&blockId="+series_id;},
//                ThumbLocator:function(section_id){return "fprox.php?feeder=thumbnail&id="+section_id;},
//                
//                AtlasLocator:function(atlas_id){return atlas_id+".json";},
//                AtlasVolumeLocator:function(atlas_id){return atlas_id+".pack";},
//                
//                DZILocator:function(section_id){return "fprox.php?feeder=openzoom&id="+section_id;},
//                TileLocator:function(section_id,level,x,y,format){
//                    return "fprox.php?feeder=openzoom/tile&id="+section_id+"&level="+level+"&column="+x+"&row="+y+"&format="+format;
//                }
//            };

// CSCS
var locators = {
    SeriesLocator: function (series_id) {
        return series_id;
    },
//                ThumbLocator:function(section_id){
//                    return "https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/"+
//                            args.pyramids+"/"+
//                            section_id+".png";
//                },

    AtlasLocator: function (atlas_id) {
        return atlas_id + ".json";
    },
    AtlasVolumeLocator: function (atlas_id) {
        return atlas_id + ".pack";
    },

//                DZILocator:function(section_id){
//                    return "https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/"+
//                            args.pyramids+"/"+
//                            section_id+"/"+
//                            section_id.substring(0,section_id.lastIndexOf("."))+".dzi";//(location.search.includes("&xml")?".xml":".dzi");
//                },
//                TileLocator:function(section_id,level,x,y,format){
//                    return "https://object.cscs.ch/v1/AUTH_08c08f9f119744cbbf77e216988da3eb/"+
//                            args.pyramids+"/"+
//                            section_id+"/"+
//                            section_id.substring(0,section_id.lastIndexOf("."))+"_files/"+
//                            level+"/"+x+"_"+y+".png";
//                }
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
            }
};
