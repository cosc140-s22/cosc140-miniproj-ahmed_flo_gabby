const hide_caption = (id) => {
  document.getElementById(id).style.opacity = 0;
};
const show_caption = (id) => {
  document.getElementById(id).style.opacity = 1;
};

const is_valid_postal_code = (postal_code) => {
  const postal_code_regex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
  return postal_code.match(postal_code_regex) !== null;
};

const display_map = async () => {
  const address = document.getElementById("site-location").text;
  const postal_code = address.split(" ").slice(-2).join(" ");
  const search = is_valid_postal_code(postal_code) ? postal_code : address;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
  );
  const data = await res.json();

  console.table({
    searched: search,
    got: data,
  });

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
