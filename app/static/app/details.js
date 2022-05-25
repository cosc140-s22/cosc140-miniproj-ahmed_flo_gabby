const hide_caption = (id) => {
  document.getElementById(id).style.opacity = 0;
};
const show_caption = (id) => {
  document.getElementById(id).style.opacity = 1;
};

const get_map_config = () => {
  const params = new URLSearchParams(location.search);
  const config = {
    lat: params.get("lat"),
    lon: params.get("lon"),
    zoom: 16,
  };

  if (config.lat === null || config.lon == null) {
    //Default to Lat and Lon of Wales if error in data
    config.lat = 52.2928116;
    config.lon = -3.73893;
    config.zoom = 5;
  }

  return config;
};

const display_map = () => {
  map_config = get_map_config();
  document.getElementById("map").style.height = "400px";
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([map_config.lon, map_config.lat]),
      zoom: map_config.zoom,
    }),
  });
  document.getElementById("loader").style.display = "none";
};

window.addEventListener("load", display_map);
