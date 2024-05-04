import { detectIcon, detectType, setStorage } from "./helpers.js";

const form = document.querySelector("form");
const list = document.querySelector("ul");

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup = L.layerGroup();

// Kullanıcının konumunu öğrenme
navigator.geolocation.getCurrentPosition(loadMap);

// Localden gelen notesleri listeleme
renderNoteList(notes);

// Haritaya tıklanınca çalışır.
function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
}

// Kullanıcının konumuna göre ekrana haritayı gösterme
function loadMap(e) {
  // Haritanın kurulumu
  map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 12);
  L.control;
  // Haritanın nasıl gözükeceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Haritada ekrana basılınca imleci tutacağımız katman
  layerGroup = L.layerGroup().addTo(map);

  // localden gelen notesları listeleme
  renderNoteList(notes);

  // Haritada tıklanma olduğunda çalışacak fonksiyon
  map.on("click", onMapClick);
}
// Ekrana marker basma
function renderMarker(item) {
  // Marker oluşturur
  L.marker(item.coords, { icon: detectIcon(item.status) })
    // İmleçlerin olduğu katmana ekler
    .addTo(layerGroup)
    // üzerine tıklanınca popup ekleme markeri oluşturur
    .bindPopup(`${item.desc}`);
}

//form gönderildiğinde çalışır
function handleSubmit(e) {
  e.preventDefault();
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  // Notes dizisine eleman ekler
  notes.push({ id: new Date().getTime(), desc, date, status, coords });
  // Local storage güncelleme
  setStorage(notes);
  // Notları ekrana aktarabilmek için fonksiyona notes dizisini parametre olarak gönderdik
  renderNoteList(notes);

  // Form gönderildiğinde kapanır
  form.style.display = "none";
}

function renderNoteList(item) {
  list.innerHTML = "";

  // markerları temizler
  layerGroup.clearLayers();

  item.forEach((item) => {
    const listElement = document.createElement("li");
    // Datasına sahip olduğu ID yi ekleme
    listElement.dataset.id = item.id;
    listElement.innerHTML = `      
      <div>
        <p>${item.desc}</p>
        <p><span>Tarih:</span>${item.date}</p>
        <p><span>Durum:</span>${detectType(item.status)}</p>
      </div>
      <i class="bi bi-x" id="delete"></i>
      <i class="bi bi-airplane-fill" id="fly"></i>`;

    list.insertAdjacentElement("afterbegin", listElement);

    // Ekrana Marker Bastırma

    renderMarker(item);
  });
}
function handleClick(e) {
  console.log(e.target.id);
  // Güncellenecek elemanın id'sini öğrenme
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    notes = notes.filter((note) => note.id != id);
    console.log(notes);
    // Local storage güncelleme
    setStorage(notes);

    // Ekranı güncelleme
    renderNoteList(notes);
  }

  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
}
