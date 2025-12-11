import './style.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import ImageLayer from 'ol/layer/Image.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import { toLonLat } from 'ol/proj';

const a = "http://localhost:8080/geoserver/land_matrix/"

// Couche : Fond de carte OSM
const coucheOSM = new TileLayer({
  source: new OSM()
});

// Couche : deals
const deals = new ImageWMS({
  url: a.concat("wms"),
  params: {
    'LAYERS': 'land_matrix:deals',
  },
  serverType: 'geoserver',
});

const layerDeals = new ImageLayer({
  source : deals
});

// Couche : deals by country
const sourceCentroid = new VectorSource({
  format: new GeoJSON(),
  url: a.concat("ows?service=WFS&version=1.0.0&request=GetFeature&typeName=land_matrix%3Adeals_by_country_centroid&maxFeatures=50&outputFormat=application%2Fjson"),
});

function getStyleCentroid(feature) {
  const nDeals = feature.get('n_deals');
  const rayon = Math.sqrt(nDeals) * 8;
  const style = new Style({
    image: new Circle({
      radius: rayon,
      fill: new Fill({ color: 'rgba(245, 156, 39, 0.5)' }),
      stroke: new Stroke({ color: 'rgba(224, 139, 31, 0.5)', width: 1 }),
    }),
  });
  return style;
}

const layerCentroid = new VectorLayer({
  source: sourceCentroid,
  style: getStyleCentroid,
});

const map = new Map({
  target: 'map',
  layers: [coucheOSM, layerCentroid, layerDeals],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

console.log("Yoooo!");

// const title = document.getElementById("title");
// console.log(title);
// console.log(title.innerHTML);
// title.innerHTML = "Ma super carte !";

const button = document.getElementById("bouton");

// function direBonjour() {
//   console.log("Bonjour !");
// }

// button.addEventListener('click', direBonjour);

// const title = document.getElementById("title");

// function titreOrange() {
//   title.style.color = "orange";
// }

// button.addEventListener('click', titreOrange);

// button.addEventListener('click', function () {
//   map.removeLayer(layerCentroid);
// });

// map.on('singleclick', function (evt) {
//   console.log(toLonLat(evt.coordinate));
// });

// AJOUTER DE L'INTERACTION

// layerCentroid.setVisible(false);

const checkboxCountries = document.getElementById('checkbox-countries');

checkboxCountries.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    // On fait des trucs quand la checkbox est checkée
    layerCentroid.setVisible(true);
  } else {
    // On fait des trucs quand la checkbox n’est PAS checkée
    layerCentroid.setVisible(false);
  }
});

const checkboxDeals = document.getElementById('checkbox-deals');

checkboxDeals.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    // On fait des trucs quand la checkbox est checkée
    layerDeals.setVisible(true);
  } else {
    // On fait des trucs quand la checkbox n’est PAS checkée
    layerDeals.setVisible(false);
  }
});

// INTERROGER UNE COUCHE WMS (DEALS)

map.on('singleclick', (event) => {
  console.log("J’ai cliqué sur la carte !");

  const coord = event.coordinate;
  const res = map.getView().getResolution();
  const proj = 'EPSG:3857';
  const parametres = {'INFO_FORMAT': 'text/html'};

  const url = deals.getFeatureInfoUrl(coord, res, proj, parametres);

  if (url) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById('attributes').innerHTML = html;
        console.log(html);
      });
  }
});