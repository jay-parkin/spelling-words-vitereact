import randomColourProperty from "../functions/RandomColourProperty";

export default function SettingsPage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Settings Page
      </h1>
    </>
  );
}
