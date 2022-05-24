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

const api_req = async (search) => {
  let result = localStorage.getItem(search);
  if (result == null) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
    );
    const data = await res.json();
    // Store the result of the API request locally to not have to repeat it when not needed
    localStorage.setItem(search, JSON.stringify(data));
    console.log("From API request: ");
    return data;
  } else {
    console.log("From local storage: ");
    return JSON.parse(result);
  }
};

const get_map_config = async () => {
  const address = document.getElementById("site-location").text;
  const postal_code = address.split(" ").slice(-2).join(" ");
  const search = is_valid_postal_code(postal_code) ? postal_code : address;
  const data = await api_req(search);

  console.table({
    searched: search,
    got: data,
  });

  const config = {
    lat: 0,
    lon: 0,
    zoom: 0,
  };

  try {
    config.lat = parseFloat(data[0]["lat"]);
    config.lon = parseFloat(data[0]["lon"]);
    config.zoom = 16;
  } catch (e) {
    //Default to Lat and Lon of Wales if error in data
    config.lat = 52.2928116;
    config.lon = -3.73893;
    config.zoom = 5;
  }

  return config;
};

const display_map = async () => {
  try {
    map_config = await get_map_config();
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
  } catch (error) {
    document.getElementById("map-error-msg").style.display = "block";
  }
};

window.addEventListener("load", display_map);
