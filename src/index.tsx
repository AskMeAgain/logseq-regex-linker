import "@logseq/libs";
import ReactDOM from "react-dom/client";
import {App} from "~/app";
import {processBlock} from "~/processBlock";

const main = () => {
  //@ts-expect-error
  new top!.MutationObserver((x) => processBlock(x)).observe(top?.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });

  ReactDOM.createRoot(document.querySelector("#app")!).render(<App/>);

  logseq.provideModel({
    openRegexLinker() {
      logseq.toggleMainUI();
    },
  });

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
