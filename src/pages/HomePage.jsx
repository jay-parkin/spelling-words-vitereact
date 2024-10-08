import HomePageStats from "../components/HomePageStats";
import randomColourProperty from "../functions/RandomColourProperty";


export default function HomePage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Welcome to the Home Page
      </h1>
      <HomePageStats />
    </>
  );
}
