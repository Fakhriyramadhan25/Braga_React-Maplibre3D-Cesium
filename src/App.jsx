
// React dependencies 
import { useState, useRef, useEffect } from 'react';

// components dependencies 
import Navibar from './components/Navibar';

// deckgl and maplibre 3d dependency 
import { MapboxOverlay} from '@deck.gl/mapbox';
import {ScatterplotLayer} from '@deck.gl/layers';
import {CesiumIonLoader } from '@loaders.gl/3d-tiles';
import {Tile3DLayer} from '@deck.gl/geo-layers';
import { TbLayersIntersect2 } from "react-icons/tb";
import maplibregl from 'maplibre-gl';


// css for maplibre 
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css'
import './App.css'
import { useCallback } from 'react';

// environment to store secret api key 
// import env from "react-dotenv";
// import 'dotenv/config'

 

function App() {

  // parameter for maplibre visualization 
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(115.1593520722);
  const [lat, setLat] = useState(-1.5318248738);
  const [zoom, setZoom] = useState(17);

  // token api key for cesium and map tiler 
  //// you need to change this section
  const ION_ASSET_ID = ;
  const ION_TOKEN = "";
  const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;
  const apiKey = "";

  useEffect(() => {
    // declaring map using useref thus it doesnt reload when change causing by useeffect 
    if (map.current) return; // stops map from intializing more than once
  
    // declaring map 
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [lng,lat],
      zoom: zoom,
      pitch: 45,
      bearing: -17.6,
      antialias: true

    });

    // adding a navigation control 
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');


    // create 3d layer from cesium 
    const overlayJembatan = new MapboxOverlay({
      interleaved: false,
      layers: [
        new Tile3DLayer({
          id: 'tile-3d-layer',
          // tileset json file url
          data: TILESET_URL,
          loader: CesiumIonLoader,
          // https://cesium.com/docs/rest-api/
          loadOptions: {
            'cesium-ion': {accessToken: ION_TOKEN}
          }
        }),
        new ScatterplotLayer({
          id: 'my-scatterplot',
          data: [
            {position: [115.1593520722, -1.5318248738], size: 50}
          ],
          getPosition: d => d.position,
          getRadius: d => d.size,
          getFillColor: [255, 255, 0],
          opacity:0.1
        }),
      ]
    });

    // wait for map to be ready
  map.current.on('load', () => {
  // insert the layer into the map using addcontrol 
  map.current.addControl(overlayJembatan);
});

  
  }, [zoom, lng, lat]);

  const [layerActive, setLayerActive] = useState(true);

  // event handling for changing basemap
  const handleActivate = useCallback(()=>{
    setLayerActive(!layerActive)
    if(layerActive === false){
      map.current.setStyle(`https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`);
    }
    else if(layerActive === true){
      map.current.setStyle(`https://api.maptiler.com/maps/hybrid/style.json?key=${apiKey}`)
    }
  },[layerActive])

  return (
    <>
    <Navibar/>

    {/* basemap switcher button  */}
    <div className='absolute top-20 left-3 p-2 rounded-lg bg-white z-10 hover:bg-sky-300' onClick={handleActivate}>
      <TbLayersIntersect2  size={24}/>
    </div>

    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
    </>
  )
}

export default App
