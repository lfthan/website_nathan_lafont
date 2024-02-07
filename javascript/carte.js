/**
 * Auteur : Nathan Lafont
 * Date : 16/10/2023
 */

var map = null ;

// /*Eléments contenu dans le popup*/
// const container = document.getElementById('popup');
// let content = document.getElementById('popup-content');
// const closer = document.getElementById('popup-closer');

// /* Crée une superposition pour ancrer le popup à la carte */
// const overlay = new ol.Overlay({
//     element: container
// });

// /* Ajout d'un gestionnaire de clics pour masquer le popup
//   * @return {boolean} */
// closer.onclick = function () {
//     overlay.setPosition(undefined);
//     closer.blur();
//     return false;
// };

window.onload = function () {


    map = Gp.Map.load(
        "carte",
        {
            //clef(s) d'accès à la plateforme. 
            //En fonction de la valeur permet d'accèder à différentes choses sur GP
            apiKey: "cartes,essentiels",

            //centrage automatique de la carte
            center: {
                x: -4.620391,
                y: 48.268698,

                projection : "CRS:84"
            },

            //Zoom de 1 à 21
            zoom: 1,

            //Renseigner les couches
            layersOptions : {

                "ORTHOIMAGERY.ORTHOPHOTOS":{
                    title : "OrthoPhoto",
                    description : "...",
                    position : 1 
                },
                "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" : {
                    title : "PLAN IGN",
                    description :"...",
                    opacity : 0.5,
                    position: 2
                },
                "osm" : {
                    title : "OSM",
                    description :"OpenStreetMap",
                    format: "osm",
                    url: "https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
                    visibility: false,
                    opacity : 0.5,
                    position: 3
                },

                "paysvisites" : {
                    title : "Les pays visités",
                    description :"Données locales en GeoJSON",
                    format : "GeoJSON",
                    url : "../datas/pays_visites.geojson",
                    styleOptions : {
                        polyFillColor: "#CCE5FF",
                        strokeWidth: 1,
                        
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
                        polyFillColor: "#FF0000",
                        markerSrc : "../images/icones/map_pointer.png",
                        markerXAnchor : 5,
                        markerYAnchor: 8,
                    },
                    position: 5,
                    legends : [{
                        url : "./legende.png",
                        format : "image/png"
                    }]
                }
            },

            //Options de controle
            controlsOptions: {
                // ajout d'une barre de recherche
                "search": {
                    maximised: true
                },
                "layerSwitcher" : {}
            },
        }
    );
}

var lieuxdevie_popup = L.geoJson(
    lieuxdevie, {
        onEachFeature: function(feature, layer){
            console.log(feature.properties);
            content = "Nom : " + feature.properties.nom + "<br> En : " + feature.properties.annee_arri; 
            layer.bindPopup(content);
        }
    }
).addTo(map);