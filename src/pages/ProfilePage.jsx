import randomColourProperty from "../utils/RandomColourProperty";

export default function ProfilePage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Profile Page
      </h1>
    </>
  );
}
