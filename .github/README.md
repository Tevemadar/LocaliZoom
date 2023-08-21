# LocaliZoom
LocaliZoom is a pan-and-zoom type viewer displaying high-resolution image series coupled with overlaid atlas delineations. Both linear (QuickNII) and nonlinear (VisuAlign) registrations are supported. User documentation is provided on [readthedocs.io](https://localizoom.readthedocs.io/en/latest/), source code is on [GitHub](https://github.com/Tevemadar/LocaliZoom).

## Three operating modes
* Display series with atlas overlay. Both [linear](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/quicknii.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom) and [nonlinear](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/visualign.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom) alignments are supported
* [Create](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/quicknii.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom&tools&nl) or [edit](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/visualign.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom&tools&nl) nonlinear alginments
* Create [markup](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/visualign.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom&tools) which can be exported as MeshView point clouds or Excel sheets.

## The catch
* Linear alignment data has to exist beforehand, LocaliZoom can't create it. Besides QuickNII, there are also DeepSlice and WebAlign which can help with creating a suitable linear registration. Propagation is supported, so when a series looks ready in QuickNII, it will work with LocaliZoom too
* LocaliZoom works with multi-resolution tiled image pyramids, it uses the [Deep Zoom](https://en.wikipedia.org/wiki/Deep_Zoom) format in particular (DZI). Besides being the de-facto standard viewer for this format, OpenSeadragon has compiled a list of [utilities](https://openseadragon.github.io/examples/creating-zooming-images/) which can be used to convert images to this format. The usage of these converters falls outside the scope of this page.

## Accessing LocaliZoom
It's important to point out that the most painless way for researchers is to register an [EBRAINS account](https://ebrains.eu/register) (free of charge but requires either an email address from a research institution, or a plausible use case), then image conversion is covered too.

And the other way is hosting a custom data source and using LocaliZoom with that one. In this case image conversation may be a pain, but no registration is needed.
## Configuration
LocaliZoom is configured via its `configuration.js` file (general settings for the deployment) and some URL parameters (identifying actual data and the atlases). The demo links above are hosted as [GitHub pages](https://pages.github.com/), and use an external data source (those 62 DZI pyramids consist of a bit more than 1.6 million tiles - 256x256 pixel square images, which is quite typical, and occupy more than 4.3 gigabytes, which is actually smaller than normal, but it still isn't a good fit for hosting on GitHub).

### Simpler, co-located case
For simplicity the demo dataset has its own co-located LocaliZoom installation too, this approach results in the simplest configuration file and implicitly avoids some possible pitfalls, like [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
* The dataset itself is browseable as https://data-proxy.ebrains.eu/localizoom
* It can be downloaded as a whole, which happens via Actions/Download Bucket. The result will be a 4.3+ GB `.zip` file, with the 1.6+ million files inside. Exact numbers are [here](https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/stat)
* The [`!LocaliZoom`](https://data-proxy.ebrains.eu/localizoom?prefix=%21LocaliZoom%2F) folder contains LocaliZoom itself, with a single atlas this time (4th version of the WHS SD Rat atlas). The `!` is there for ordering purposes only, it comes earlier than numbers in ASCII, so the `!` things are displayed first in this particular data management interface
* The [`!Series`](https://data-proxy.ebrains.eu/localizoom?prefix=%21Series%2F) folder contains an actual offline QuickNII/VisuAlign series. The two `.json` files are actually in use by the demo links, the `.xml` files (outputs of `FileBuilder` and `QuickNII`) are provided for completeness only
* `!Series.zip` is the downloadable version of the previous folder (the linked data management interface can download a single file at a time)
* Link of this co-hosted demo: [`!LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=../!Series/visualign.json&tools&nl`](https://object.cscs.ch/v1/AUTH_7e4157014a3d4c1f8ffe270b57008fd4/localizoom/!LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=../!Series/visualign.json&tools&nl)  
Breakdown of the URL:
  * LocaliZoom starts with `filmstripzoom.html` (`index.html` is this very page)
  * `atlas` URL parameter identifies the atlas to use. This LocaliZoom deployment simply has the related `.json` and `.pack` files right next to it. While the atlas identifier is already present in series descriptors of QuickNII/VisuAlign, having it as a separate parameter allows checking series with different atlas versions
  * `series` URL parameter links to an actual `.json` file, it is co-hosted here, and uses a relative location here
  * `tools` URL parameter enables annotation tools by default...
  * ... and nonlinear tools if `nl` URL parameter is also present.

Of course LocaliZoom also has to find the image pyramids themselves, which brings us to the [`configuration.js`](https://object.cscs.ch/v1/AUTH_7e4157014a3d4c1f8ffe270b57008fd4/localizoom/!LocaliZoom/configuration.js) file. Amongst other tasks, this small file is responsible for locating the actual pyramid files, based on the contents coming from the series descriptor.

A QuickNII (or VisuAlign) [series descriptor](https://object.cscs.ch/v1/AUTH_7e4157014a3d4c1f8ffe270b57008fd4/localizoom/!Series/visualign.json) refers to actual, local image files, residing next to the descriptor, and usually being in `.png` or `.jpg` format:

    {
        "name": "Test series",
        [...]
        "slices": [
            {
                "filename": "14122_mPPC_BDA_s006.png", <-- existing file in the !Series folder (and .zip)

Clicking around in the [example dataset](https://data-proxy.ebrains.eu/localizoom) shows what we actually have:
* a [`14122_mPPC_BDA_s006.tif`](https://data-proxy.ebrains.eu/localizoom?prefix=14122_mPPC_BDA_s006.tif%2F) folder, this folder comes from the converter service of EBRAINS (and it's a `.tif` because the original file was in that format)
* with a `14122_mPPC_BDA_s006.dzi` file inside
* and a `14122_mPPC_BDA_s006_files` folder next to it (having a pair of `xy.dzi` and `xy_files` comes from the Deep Zoom format).

This is what the [configuration file](https://object.cscs.ch/v1/AUTH_7e4157014a3d4c1f8ffe270b57008fd4/localizoom/!LocaliZoom/configuration.js) has to reproduce when asked to. It contains a `transformSeries(series)` function which allows preprocessing the entire series object (the QuickNII/VisuAlign JSON descriptor) after loading, and a `locator` object with actual functions for providing the URL of the series descriptor, `.dzi` files, tiles in the `_files` folder, and the two atlas files (`.json` and `.pack`).
#### `transfromSeries()` function

    function transformSeries(series) {
The demo function does a convenience transformation: removes the extension from `filename`, so later the locators can simply append `.tif`, `.dzi`, and `_files` to it:

        for (const slice of series.slices) {
            slice.filename = slice.filename.substring(0, slice.filename.lastIndexOf("."));
        }
And a dirty hack happens too: knowing that the demo dataset is dark, outline and marker colors are set to something light (white and magenta). This is a quite non-standard step, but it's possible.

        document.getElementById("outline").value="#FFFFFF";
        document.getElementById("ancolor").value="#00FFFF";
        document.getElementById("nlcolor").value="#00FFFF";
    }

#### `locators` object
    const locators = {
`SeriesLocator` is expected to create an actual URL from a series identifier. Here the `series` URL parameter was a complete relative path (`../!Series/visualign.json`), and thus no actual transformation is done:

        SeriesLocator: series_id => series_id,
`DZILocator` is expected to create an actual URL from a `section_id`, which is actually the `filename`, from the series. As `filename` has been stripped from its `.png` extension earlier, this step really just appends some extensions to the identifier:

        DZILocator: section_id => `../${section_id}.tif/${section_id}.dzi`,
`TileLocator` is expected to create an actual URL of a tile. DZI pyramids simply look like this: `something.dzi` is accompanied by a `something_files/` folder right next to it, where there are levels inside, also as folders (numbered from `0/`), and inside those folders there are the actual tiles, like `0_0.png`. The numbers are coming from the viewer, and the format of the tiles (`.png` here) comes from the DZI. As `filename` has been stripped from its `.png` extension earlier, this step also just merges the parameters together:

        TileLocator: (section_id, level, x, y, format) =>
                         `../${section_id}.tif/${section_id}_files/${level}/${x}_${y}.${format}`,
`AtlasLocator` is expected to create an actual URL for the atlas descriptor. As `WHS_SD_Rat_v4_39um.json` resides right next to the viewer, only the `.json` extension is added here:
 
        AtlasLocator: atlas_id => atlas_id + ".json",
`AtlasVolumeLocator` is expected to create an actual URL for the compressed atlas volume. As `WHS_SD_Rat_v4_39um.pack` resides right next to the viewer, only the `.pack` extension is added here:
        
        AtlasVolumeLocator: atlas_id => atlas_id + ".pack"
    };

### Example with remote data
A more real-life example is the one on GitHub pages, linked at the top of this page, like [`https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/quicknii.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom`](https://tevemadar.github.io/LocaliZoom/filmstripzoom.html?atlas=WHS_SD_Rat_v4_39um&series=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/quicknii.json&pyramids=https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom) (this is the first one of the innocent-looking `[demo]` links on this page). The key difference is that LocaliZoom is hosted somewhere (`https://tevemadar.github.io/LocaliZoom/filmstripzoom.html`), and the dataset is hosted somewhere else. Here complete URL-s are used (similarly to the previous case, just there these were relative URL-s). In a real-life installation, specific to a certain website, some parts of the URL would be moved into the configuration file. The `series` descriptor (`https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom/!Series/quicknii.json`) and `pyramids` (new URL argument, `https://data-proxy.ebrains.eu/api/v1/public/buckets/localizoom`) are separated. This way one image series may have multiple alignments, and it's also possible to refer image series where we could not put our series descriptors simply because of the lack of write access to the given server in general or location in particular. The actual  [`configuration.js`](https://github.com/Tevemadar/LocaliZoom/blob/master/configuration.js) is on GitHub this time, and it also contains jsdoc documentation.

#### `TileLocator`
Apart from the documentation part it has two new things: it tells that the URL parameters are actually available in an object called `args`, and the `TileLocator` makes use of it:

    TileLocator: (section_id, level, x, y, format) =>
        `${args.pyramids}/${section_id}.tif/${section_id}_files`+
        `/${level}/${x}_${y}.${format}`

and that's it, what was the relative URL `../` in the previous example, became `${args.pyramids}/` now. Technically this configuration could be used for the co-located example too, via providing an extra parameter `pyramids=..`.

## Support
[EBRAINS support](https://ebrains.eu/support/) in general (no EBRAINS registration is necessary). And there is an [issue tracker](https://github.com/Neural-Systems-at-UIO/LocaliZoom/issues) on GitHub for bugs and features.

## Acknowledgements
Localizoom is developed by the Neural Systems Laboratory at the Institute of Basic Medical Sciences, University of Oslo, Norway. Localizoom was developed with support from the EBRAINS infrastructure, and funding from the European Union’s Horizon 2020 Framework Programme for Research and Innovation under the Framework Partnership Agreement No. 650003 (HBP FPA).

### Dataset
In this example a copy of "subject 14122 mPPC BDA" is used from

*Olsen, G. M., Hovde, K., Sakshaug, T., Sømme H., H., Monterotti, B., Laja, A., Reiten, I., Leergaard, T. B., & Witter, M. P. (2020). Anterogradely labeled axonal projections from the posterior parietal cortex in rat [Data set]. EBRAINS.*

https://doi.org/10.25493/FKM4-ZCC

### Theme
[Water.css](https://watercss.kognise.dev/) (dark)

## Citation
[The plan is to get an RRID, and there may be some article coming too.]
