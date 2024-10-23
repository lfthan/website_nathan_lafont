// /**
//  * Auteur : Nathan Lafont
//  * Date : 16/10/2023
//  */


var map_sdk = null;
var map = null;

//------------------------------> COUCHES
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

            mapEventsOptions: {
                // Appel de la fonction après le chargement de la carte
                "mapLoaded": after_init_map
            },
        }
    );
}

// //------------------------------> FONCTIONS

/*Eléments contenu dans le popup*/
const container = document.getElementById('popup');
let content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/* Crée une superposition pour ancrer le popup à la carte */
const overlay = new ol.Overlay({
    element: container
});

/* Ajout d'un gestionnaire de clics pour masquer le popup
  * @return {boolean} */
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

/* Définition du contenu de la pop-up */
// function after_init_map() {
//     var map_ol = map.getLibMap();
//     map_ol.addOverlay(overlay);

//     map_ol.on('click', function (evt) {
//         var r = map_ol.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
//             return {feature, layer};
//         });
//         var feature = r.feature;
//         var layer = r.layer; 

//         console.log(feature);
            
//         if (feature) {
//             // if (layer == map.getLayersByName(lieuxdevie)){
//             /* Ici je cherche à mettre en place un overlay différent selon la couche sur laquelle l'event apparait
//             Je n'ai pas réussi à trouver la bonne expression*/

//             if (feature.get('image') != null){
//                 content.innerHTML = "Destination : <strong>" + feature.get('nom') + "</strong>,<br> J'arrive ici en " + feature.get('annee_arri') + " et y vis pendant " + feature.get('duree_an') + " ans." +
//                 '<br> <center><img src="' + feature.get('image') +'" height=187 width=250 alt="Pas de photo"></center> <br> <center>'+ feature.get('code_dep')+"</center>"; 
//                 const coordinate = evt.coordinate;
//                 const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
//                 overlay.setPosition(coordinate);
//             } else {
//                 content.innerHTML = "Destination : <strong>" + feature.get('name_fr') + "</strong>,<br> J'arrive ici en " + feature.get('annee_voyage') + " et y vis pendant " + feature.get('duree_an') + " ans." +
//                 "<br> <br> <center><i>Pas de photo</i></center>"; 
//                 const coordinate = evt.coordinate;
//                 const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
//                 overlay.setPosition(coordinate);
//             }
    
//         } else {
//             overlay.setPosition(undefined);
//         }
//     });
// }


/* Fonction appelée après le chargement de la carte */
function after_init_map() {
    var map_ol = map.getLibMap();
    map_ol.addOverlay(overlay);

    map_ol.on('click', function (evt) {
        var result = map_ol.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return { feature: feature, layer: layer };
        });

        if (result && result.feature && result.layer) {
            var feature = result.feature;
            var layer = result.layer;
            console.log(feature.get('name'));
            console.log(layer);
            // Calcul du centroïde de la géométrie de la feature cliquée
            var geometry = feature.getGeometry();
            var centroid = ol.extent.getCenter(geometry.getExtent());

            // Vérification de la couche cliquée et affichage du pop-up
            if (layer.title === "Les lieux où j'ai vécu") {
                // Pop-up spécifique pour la couche "lieuxdevie"
                // content.innerHTML = `
                //     <h3>Lieux de vie</h3>
                //     <p><strong>Nom : </strong>${feature.get('nom')}</p>
                //     <p><strong>Année d'arrivée : </strong>${feature.get('annee_arri')}</p>
                //     <p><strong>Durée (ans) : </strong>${feature.get('duree_an')}</p>
                //     <p><strong>Département : </strong>${feature.get('code_dep')}</p>
                //     ${feature.get('image') ? `<img src="${feature.get('image')}" alt="Image" style="width:250px;height:187px;">` : '<i>Pas de photo disponible</i>'}
                // `;
                content.innerHTML = "lieux de vie";
            } else if (layer.get('title') === "Les pays visités") {
                // Pop-up spécifique pour la couche "paysvisites"
                // content.innerHTML = `
                //     <h3>Pays visité</h3>
                //     <p><strong>Pays : </strong>${feature.get('name_fr')}</p>
                //     <p><strong>Année du voyage : </strong>${feature.get('annee_voyage')}</p>
                //     <p><strong>Durée (ans) : </strong>${feature.get('duree_an')}</p>
                //     <i>Pas de photo disponible pour ce pays</i>
                // `;
                content.innerHTML = "Pays visité";
            }

            // Positionnement de l'overlay au centroïde de la feature
            overlay.setPosition(centroid);
        } else {
            // Masquer l'overlay si aucun élément n'est cliqué
            overlay.setPosition(undefined);
        }
    });
}