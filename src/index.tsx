import "@logseq/libs";
import ReactDOM from "react-dom/client";
import {App} from "~/app";

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
      const settings = JSON.parse(logseq.settings["regex-linker-map"]);
      let newLine = currBlock.content;
      for (const fieldName in settings) {
        const regex = new RegExp(fieldName, "g");
        if (regex.test(newLine)) {
          newLine = newLine.replaceAll(regex, settings[fieldName]);
        }
      }

      await logseq.Editor.updateBlock(uuid, newLine);
    }
  }
};

export const parseMutationObserver = (): void => {
  //@ts-expect-error
  const observer = new top!.MutationObserver((x) => callback(x));
  observer.observe(top?.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

const main = () => {
  parseMutationObserver(); // enable mutation observer

  const root = ReactDOM.createRoot(document.querySelector("#app"));

  root.render(<App />);

  logseq.provideModel({
    openRegexLinker() {
      logseq.toggleMainUI();
    },
  });

  logseq.provideStyle(`
    @import url("https://cdn.jsdelivr.net/npm/@icon/icofont@1.0.1-alpha.1/icofont.min.css");
  `);

  logseq.setMainUIInlineStyle({
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: 999,
  });

  logseq.App.registerUIItem("toolbar", {
    key: "Regex-Matcher",
    template: `
        <a data-on-click="openRegexLinker">
          r
        </a>
    `,
  });
};

logseq.ready(main).catch(console.error);
