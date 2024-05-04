export const setStorage = (data) => {
  // veriyi locale göndermek için stringe çevirme
  const strData = JSON.stringify(data);
  // Local storage güncelleme
  localStorage.setItem("notes", strData);
};

var carIcon = L.icon({
  iconUrl: "/img/car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "/img/home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "/img/job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "/img/visit.png",
  iconSize: [50, 60],
});

export function detectIcon(type) {
  switch (type) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
  }
}

export const detectType = (type) => {
  switch (type) {
    case "park":
      return "Park Yeri";
    case "home":
      return "Home";
    case "job":
      return "Job";
    case "goto":
      return "Visit";
  }
};
