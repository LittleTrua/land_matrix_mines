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

const  =

const coucheOSM = new TileLayer({
  source: new OSM()
});

const deals = new ImageWMS({
  url: 'http://localhost:8080/geoserver/land_matrix/wms',
  params: {'LAYERS': 'land_matrix:deals'},
  serverType: 'geoserver',
});

const layerDeals = new ImageLayer({
  source : deals
});

const sourceCentroid = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8080/geoserver/land_matrix/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=land_matrix%3Adeals_by_country_centroid&maxFeatures=50&outputFormat=application%2Fjson',
});

// const styleCentroid = new Style({
//   image: new Circle({
//     radius: 40,
//     fill: new Fill({ color: 'rgba(245, 156, 39, 0.5)'}),
//     stroke: new Stroke({ color: 'rgba(224, 139, 31, 0.8)', width: 2 }),
//   }),
// });

// const layerCentroid = new VectorLayer({
//   source: sourceCentroid,
//   style: styleCentroid
// });

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
  layers: [coucheOSM, layerCentroid],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

console.log("Yoooo!");