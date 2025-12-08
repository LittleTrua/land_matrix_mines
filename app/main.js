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

const styleCentroid = new Style({
  image: new Circle({
    radius: 40,
    fill: new Fill({ color: 'white' }),
    stroke: new Stroke({ color: 'blue', width: 5 }),
  }),
});

const layerCentroid = new VectorLayer({
  source: sourceCentroid,
  style: styleCentroid
});


const map = new Map({
  target: 'map',
  layers: [coucheOSM, layerDeals, layerCentroid],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

console.log("Yoooo!");