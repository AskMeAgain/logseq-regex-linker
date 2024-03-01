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

      //Execute inline parsing2
      let setting = logseq.settings!["regex-linker-map"] as string;
      if (setting === undefined || setting === null) {
        return;
      }
      const settings = JSON.parse(setting);
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