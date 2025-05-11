// Randomly select a colour per card header
const headerColours = {
  yellow: "#f8df81",
  salmon: "#f6aa90",
  pink: "#f6b4bf",
  purple: "#d5b6d5",
  blue: "#badfda",
  green: "#9bd0b7",
};

export default function randomColourProperty() {
  let keys = Object.keys(headerColours);

  return headerColours[keys[(keys.length * Math.random()) << 0]];
}
