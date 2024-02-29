import "@logseq/libs";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const callback = async (mutationsList: MutationRecord[]): Promise<void> => {
  for (const m of mutationsList) {
    if (
      m.type === "childList" &&
      m.removedNodes.length > 0 &&
      (m.removedNodes[0]! as HTMLElement).className ===
        "editor-inner block-editor"
    ) {
      const uuid = (m.target as HTMLElement)
        .closest('div[id^="ls-block"]')
        ?.getAttribute("blockid") as string;
      const currBlock = await logseq.Editor.getBlock(uuid);
      if (!currBlock) return;

      //Execute inline parsing
      const newStr = currBlock.content.replace(
        /LE-(.*)4/,
        "[$1](http://$1.de)",
      );
      // const content = await parse.inlineParsing(currBlock);
      await logseq.Editor.updateBlock(uuid, newStr);
    }
  }
};

export const parseMutationObserver = (): void => {
  //@ts-expect-error
  const observer = new top!.MutationObserver(callback);
  observer.observe(top?.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

function App() {
  const [settings, setSettings] = useState(logseq.settings);

  useEffect(() => {
    logseq.on("settings:changed", (a) => {
      setSettings(a);
    });
  }, []);

  return (
    <div>
      <h1>DIALOG</h1>

      <p className="ctl">
        <button
          onClick={() => {
            logseq.hideMainUI();
          }}
        >
          OK
        </button>
      </p>
    </div>
  );
}

const main = () => {
  parseMutationObserver(); // enable mutation observer

  const root = ReactDOM.createRoot(document.querySelector("#app"));

  root.render(<App />);

  logseq.provideModel({
    openFontsPanel(e) {
      const { rect } = e;

      logseq.setMainUIInlineStyle({
        top: `${rect.top + 20}px`,
        left: `${rect.right - 10}px`,
      });

      logseq.toggleMainUI();
    },
  });

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.keyCode === 27) {
        logseq.hideMainUI();
      }
    },
    false,
  );

  logseq.setMainUIInlineStyle({
    position: "fixed",
    width: "290px",
    zIndex: 999,
    transform: "translateX(-50%)",
  });

  logseq.App.registerUIItem("toolbar", {
    key: "awesome-fonts-btn",
    template: `
        <a 
           style="font-weight: bold"
           data-on-click="openFontsPanel" 
           data-rect
        >
          o
        </a>
    `,
  });
};

logseq.ready(main).catch(console.error);
