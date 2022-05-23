const hide_caption = (id) => {
  document.getElementById(id).style.opacity = 0;
};
const show_caption = (id) => {
  document.getElementById(id).style.opacity = 1;
};
const display_map = async () => {
  const site_location = document.getElementById("site-location").text;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${site_location}&format=json`
  );
  const data = await res.json();
  let lat,
    lon,
    zoom = 0;
  try {
    lat = parseFloat(data[0]["lat"]);
    lon = parseFloat(data[0]["lon"]);
    zoom = 16;
  } catch (e) {
    //Default to Lat and Lon of Wales if error in data
    lat = 52.2928116;
    lon = -3.73893;
    zoom = 5;
  }
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([lon, lat]),
      zoom: zoom,
    }),
  });
  document.getElementById("loader").style.display = "none";
};
window.addEventListener("load", display_map);
