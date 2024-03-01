import {useState} from "react";

export function App() {
  const settings = logseq.settings;
  const [map, setMap] = useState(settings["regex-linker-map"] ?? "{}");

  return (
    <>
      <div
        onClick={() => logseq.hideMainUI()}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          height: "100%",
          width: "100%",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>
      <div
        style={{
          transform: 'translateY(50%) translateX(50%)',
          zIndex: "1000000000",
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          height: '300px',
          backgroundColor: "white",
          width: "50%",
          padding: "20px",
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        <span style={{display: 'flex'}}>Regex Linker Map</span>
        <textarea
          style={{display: 'flex', flexGrow: '1'}}
          onChange={(x) => setMap(x.target.value)}
          value={map}
        ></textarea>
        <button
          onClick={() => {
            logseq.updateSettings({...settings, "regex-linker-map": map});
            logseq.hideMainUI();
          }}
        >
          Save
        </button>
      </div>
    </>
  );
}