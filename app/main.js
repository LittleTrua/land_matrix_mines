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

const coucheOSM = new TileLayer({
  source: new OSM()
});

const coucheDeals = new ImageWMS({
  url: 'http://localhost:8080/geoserver/land_matrix/wms',
  params: {'LAYERS': 'land_matrix:deals'},
  serverType: 'geoserver',
});

const maCouche = new ImageLayer({
  source : coucheDeals
});

const dealsByCountryCentroid = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8080/geoserver/land_matrix/ows?service=WFS'
});

const layerCentroid = new VectorLayer({
  source: sourceCentroid,
});

const map = new Map({
  target: 'map',
  layers: [coucheOSM, maCouche, layerCentroid],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

console.log("Yoooo!");