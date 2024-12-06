/**
 * Auteur : Nathan Lafont
 * Date : 10.15.2024
 */

var map_ol = null;
var map_sdk = null;

const white = [255, 255, 255, 1];
const blue = [0, 153, 255, 1];


// ------------------------------> Style et définition de couche LDV

//---------- STYLE ----------

// Style de lieux de vie

function style_ldv(feature){

    return[
        new ol.style.Style({
            image: new ol.style.Circle({
                radius : 5,
                fill: new ol.style.Fill({
                    color: blue,
                }),
                stroke: new ol.style.Stroke({
                    color: white,
                    width: 1,
                })
            })
        })
    ]
}

function style_pv(feature){

    return[
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255,255,255,0.3],
            }),
            stroke : new ol.style.Stroke({
                color: [150,150,150,1],
                width: 1,
            })
        })
    ]

}

//---------- PROPRIETES ----------

// Propriétés de lieux de vie

var source_ldv = new ol.source.Vector({
    format : new ol.format.GeoJSON(),
    url : "../datas/lieux_de_vie.geojson"
});

source_ldv._title = "Lieux de vie";
source_ldv._description = "Lieux où j'ai vécu au cours de ma vie";

var layer_ldv = new ol.layer.Vector({
    source : source_ldv,
    style : style_ldv
});
//Set name pour retrouver la couche plus tard.
layer_ldv.set('name', 'ldv');



// Propriétés de pays visités

var source_pv = new ol.source.Vector({
    format : new ol.format.GeoJSON(),
    url : "../datas/pays_visites.geojson"
});

source_pv._title = "Pays visités";
source_pv._description = "Pays que j'ai eu la chance de visiter à une ou plusieurs reprises";

var layer_pv = new ol.layer.Vector({
    source : source_pv,
    style : style_pv
});
//Set name pour retrouver la couche plus tard.
layer_pv.set('name', 'pv');


// ------------------------------> INIT MAP
window.onload = function () {


    map_sdk = Gp.Map.load(
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

                "osm" : {
                    title : "OSM",
                    description :"OpenStreetMap",
                    format: "osm",
                    url: "https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
                    position: 1,
                },
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


//---------------------------------------------------> POP - UP
// /*Eléments contenu dans le popup*/
// const container = document.getElementById('popup');
// let content = document.getElementById('popup-content');
// const closer = document.getElementById('popup-closer');

/*Eléments contenu dans le popup*/
const fixedPanel = document.getElementById('fixed-panel');
const panelContent = document.getElementById('panel-content');
const panelCloser = document.getElementById('panel-closer');

console.log(panelCloser);

/* Crée une superposition pour ancrer le popup à la carte */
// const overlay = new ol.Overlay({
//     element: fixedPanel
// });


// /* Ajout d'un gestionnaire de clics pour masquer le popup
//   * @return {boolean} */
// closer.onclick = function () {
//     overlay.setPosition(undefined);
//     closer.blur();
//     return false;
// };

// Show fixed panel
function showPanel(content) {
    panelContent.innerHTML = content;
    fixedPanel.style.display = 'block'; // Show the panel
}

// Hide fixed panel
panelCloser.onclick = function () {
    fixedPanel.style.display = 'none'; // Hide the panel
};


// ------------------------------> INIT MAP

function after_init_map(){
    map = map_sdk.getLibMap();
    // map.addOverlay(overlay);

    map.on('click', function (evt) {
        var result = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return { feature: feature, layer: layer };
        });

        if (result && result.feature && result.layer) {
            var feature = result.feature;
            var layer = result.layer;
            // Calcul du centroïde de la géométrie de la feature cliquée
            var geometry = feature.getGeometry();
            var centroid = ol.extent.getCenter(geometry.getExtent());

            let content ='';

            // Vérification de la couche cliquée et affichage du pop-up
            if (layer.get('name') === "ldv") {
                console.log(layer.get('name'));
                // Pop-up spécifique pour la couche "lieuxdevie"
                content = `
                    <h3>Lieu de vie</h3>
                    <p><strong>Nom : </strong>${feature.get('nom')}</p>
                    <p><strong>Année d'arrivée : </strong>${feature.get('annee_arri')}</p>
                    <p><strong>Durée (ans) : </strong>${feature.get('duree_an')}</p>
                    <p><strong>Département : </strong>${feature.get('code_dep')}</p>
                    ${feature.get('image') ? `<img src="${feature.get('image')}" alt="Image" style="width:250px;height:187px;">` : '<i>Pas de photo disponible</i>'}
                `;
            } else if (layer.get('name') === "pv") {
                console.log(layer.get('name'));
                // Pop-up spécifique pour la couche "paysvisites"
                content = `
                    <h3>Pays visité</h3>
                    <p><strong>Pays : </strong>${feature.get('name_fr')}</p>
                    <p><strong>Année du voyage : </strong>${feature.get('annee_voyage')}</p>
                    <i>Pas de photo disponible pour ce pays</i>
                `;
            }

            // Positionnement de l'overlay au centroïde de la feature
            // overlay.setPosition(centroid);
            showPanel(content);

        } else {
            // Masquer l'overlay si aucun élément n'est cliqué
            // overlay.setPosition(undefined);

            fixedPanel.style.display = 'none'; //Hide if no feature clicked
        }
    });

    map.addLayer(layer_pv);
    map.addLayer(layer_ldv);
}

function refresh_view() {
    //mettre ici toutes les couches à raffraîchir
    source_ldv.refresh();
    source_pv.refresh();
    overlay.changed();
}
