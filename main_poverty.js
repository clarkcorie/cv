require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/renderers/ClassBreaksRenderer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/widgets/Legend",
        "esri/widgets/Search",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Home"
    ],
    (Map, MapView, FeatureLayer, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Legend, Search, BasemapToggle, Home) => {

        const map = new Map({
            basemap: "topo-vector"

        });

        const view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-123.2299, 44.4994],
            zoom: 10
        });

        const basemapToggle= new BasemapToggle({
            view: view,
            nextBasemap: "hybrid"

        });

        const homeWidget = new Home({
            view: view

        });

        const template = {
            title: "Benton County Block Group Data:",
            content: "<p>As of 2020, <b>{percap}% </b> of households in this block group are eligible to receive SNAP benefits.</p>" +
                "<ul><li>There are {poverty_ho} total households in this block group.</li>" +
                "<li>Of those households, {poverty__1} are eligible for SNAP benefits.</li>"

        };

        const searchWidget = new Search({
            view: view

        });

        const countyRenderer = new ClassBreaksRenderer({
            field: "percap",
            legendOptions: {
                title: "Eligibility"
            }
        });

        const addClass = function(min, max, clr, lbl, renderer) {
            renderer.addClassBreakInfo({
                minValue: min,
                maxValue: max,
                symbol: new SimpleFillSymbol({
                    color: clr
                }),
                label: lbl
            })
        }

        addClass(0, 19, "#edf8fb", "under 19%", countyRenderer);
        addClass(20, 25, "#bfd3e6", "up to 25%", countyRenderer);
        addClass(26, 32, "#9ebcda", "up to 32%", countyRenderer);
        addClass(33, 41, "#8c96c6", "up to 41%", countyRenderer);
        addClass(42, 58, "#8856a7", "up to 58%", countyRenderer);

        const countyLyr = new FeatureLayer({
            portalItem: {
                id: "e5e3cb59bcb54037b0d49b4b11ab480f"
            },
            renderer: countyRenderer,
            opacity: 0.65,
            outFields: ["percap", "poverty_ho", "poverty__1"],
            popupTemplate: template
        });

        map.add(countyLyr)

        const legend = new Legend({
            view: view,
            layerInfos: [{
                layer: countyLyr,
                title: "SNAP Benefits per Household"
            }]
        });

        view.ui.add(legend, "bottom-right");
        view.ui.add(searchWidget, "top-right");
        view.ui.add(basemapToggle, "bottom-left");
        view.ui.add(homeWidget, "top-left");

    });