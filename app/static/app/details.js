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
  let lat = parseFloat(data[0]["lat"]);
  let lon = parseFloat(data[0]["lon"]);
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([lon, lat]),
      zoom: 16,
    }),
  });
  document.getElementById("loader").style.display = "none";
};
window.addEventListener("load", display_map);
