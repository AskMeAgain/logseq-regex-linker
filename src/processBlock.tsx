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

      let newLine = currBlock.content;

      for (let i = 1; i <= 5; i++) {
        let setting = logseq.settings!["regex-map-" + i] as string;
        if (setting === undefined || setting === null  || setting === "") {
          continue;
        }
        const split = setting.split("::::");
        if(split.length != 2){
          continue;
        }

        const replacement = split[1] as string;
        const regexStr = split[0] as string;

        const regex = new RegExp(regexStr, "g");
        if (regex.test(newLine)) {
          newLine = newLine.replaceAll(regex, replacement);
        }
      }

      await logseq.Editor.updateBlock(uuid, newLine);
    }
  }
};