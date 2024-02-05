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
                //Hopital d'Ales(30)
                x: -4.620391,
                y: 48.268698,

                projection : "CRS:84"
            },

            //Zoom de 1 à 21
            zoom: 1,

            //Renseigner les couches
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
            
            markersOptions:[{
                position: {
                    x: -4.620391,
                    y: 48.268698,
                    projection: "EPSG:3857"
                },
                content : "<h1>Pôle Géosciences</h1><br/><p>73 avenue de Paris, Saint-Mandé</p><br/><p><img src ='../images/reunion/fournaise.JPG' height = 150px width = 200px /></p>",
                url : "../images",
                //Décalage de l'image par rapport au point donné
                offset: [-15,-30]
            }],
        }
    );
}