import "@logseq/libs";
import {processBlock} from "~/processBlock";

const main = () => {
  //@ts-expect-error
  new top!.MutationObserver((x) => processBlock(x)).observe(top?.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

logseq.useSettingsSchema([
  {
    key: "regex-map-1",
    default: "",
    description: "Regex Replacement Map Slot 1",
    title: "Regex Map",
    type: "string"
  },
  {
    key: "regex-map-2",
    default: "",
    description: "Regex Replacement Map Slot 2",
    title: "Regex Map",
    type: "string"
  },
  {
    key: "regex-map-3",
    default: "",
    description: "Regex Replacement Map Slot 3",
    title: "Regex Map",
    type: "string"
  },
  {
    key: "regex-map-4",
    default: "",
    description: "Regex Replacement Map Slot 4",
    title: "Regex Map",
    type: "string"
  },
  {
    key: "regex-map-5",
    default: "",
    description: "Regex Replacement Map Slot 5",
    title: "Regex Map",
    type: "string"
  }
  ]).ready(main).catch(console.error);
