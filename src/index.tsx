import "@logseq/libs";

export const processBlock = async (mutationsList: MutationRecord[]): Promise<void> => {
  for (const m of mutationsList) {
    if (
      m.type === "childList" &&
      m.removedNodes.length > 0 &&
      (m.removedNodes[0]! as HTMLElement).className === "editor-inner block-editor"
    ) {
      const uuid = (m.target as HTMLElement).closest('div[id^="ls-block"]')?.getAttribute("blockid") as string;
      const currBlock = await logseq.Editor.getBlock(uuid);
      if (!currBlock) return;

      //adding this lines as this allows us to split the line correctly
      let newLine = " " + currBlock.content + " ";

      for (let i = 1; i <= 5; i++) {
        let setting = logseq.settings!["regex-map-" + i] as string;
        if (setting === undefined || setting === null || setting === "") {
          continue;
        }

        const split = setting.split("::::");
        if (split.length != 2) {
          continue;
        }

        const regex = new RegExp(split[0] as string, "g");
        const replacement = split[1] as string;

        const allMatches = newLine.matchAll(regex);
        const uniqueMatches = new Set<string>();
        for (const match of allMatches) {
          uniqueMatches.add(match[0]);
        }

        for (const matchedString of uniqueMatches) {
          const replacedString = matchedString.replaceAll(regex, replacement);

          newLine = newLine.split(replacedString)
            //no regex replacement here
            .map(x => x.replaceAll(matchedString, replacedString))
            //joining back
            .join(replacedString);
        }
      }

      if (currBlock.content !== newLine.trim()) {
        await logseq.Editor.updateBlock(uuid, newLine);
      }
    }
  }
};

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
