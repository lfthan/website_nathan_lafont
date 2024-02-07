var map = null ;

window.onload = function () {

    map = Gp.Map.load(
        "carte",
        {

        layersOptions : {
            "paysvisites" : {
                title : "Les pays visités",
                description :"Données locales en GeoJSON",
                format : "GeoJSON",
                url : "../datas/pays_visites.geojson",
                styleOptions : {
                    polyFillColor: "#FF0000"
                },
                position: 4,
                legends : [{
                    url : "./legende.png",
                    format : "image/png"
                }]
            },

            "lieuxdevie" : {
                title : "Les lieux où j'ai vécu",
                description :"Données locales en GeoJSON",
                format : "GeoJSON",
                url : "../datas/lieux_de_vie.geojson",
                styleOptions : {
                    polyFillColor: "#FF0000"
                },
                position: 4,
                legends : [{
                    url : "./legende.png",
                    format : "image/png"
                }]
            },

            markersOptions:[{
                position: {
                    x: 45.132227668460331,
                    y: 44.122147110462855,
                    projection: "EPSG:3857"
                },
            
                content : "<h1>Naissance</h1><br/><p>Je nait à Ales(30) en 2020</p><br/><p><img src ='../images/reunion/fournaise.JPG' height = 150px width = 200px /></p>",
                url : "../images/icones/map_pointer.png",

                offset: [-15,-30]
            }],
        }
    });
}

