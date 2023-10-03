import { ParsedResult } from "chrono-node/dist/cjs";
import {
  getDateForPage,
  getDeadlineDateDay,
  getScheduledDateDay,
} from "logseq-dateutils";
import {
  checkIfChronoObjHasTime,
  checkIfUrl,
  inlineParsing,
} from "~/features/parse/index";
import { PluginSettings } from "~/settings/types";

export const manualParse = (
  flag: string,
  content: string,
  chronoBlock: ParsedResult[],
  parsedText: string,
  parsedStart: Date,
): string => {
  const { dateChar, scheduledChar, deadlineChar } =
    logseq.settings! as Partial<PluginSettings>;
  if (!dateChar || !scheduledChar || !deadlineChar) throw new Error();

  switch (true) {
    case flag === dateChar: {
      if (!logseq.settings!.insertDateProperty) {
        const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
        content = content.replace(
          parsedText,
          `${getDateForPage(
            parsedStart,
            logseq.settings!.preferredDateFormat,
          )}${checkTime}`,
        );
        return content;
      } else {
        content = content.replace(parsedText, "");
        content = `${content}
date:: ${getDateForPage(parsedStart, logseq.settings!.preferredDateFormat)}`;
        return content;
      }
    }
    case flag === scheduledChar: {
      if (checkIfUrl(content)) return ""; // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
      content = content.replace(parsedText, "");
      content = `${content}
      SCHEDULED: <${getScheduledDateDay(parsedStart)}${checkTime}>`;
      return content;
    }
    case flag === deadlineChar: {
      if (checkIfUrl(content)) return ""; // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
      content = content.replace(parsedText, "");
      content = `${content}
      DEADLINE: <${getDeadlineDateDay(parsedStart)}${checkTime}>`;
      return content;
    }
    default: {
      throw new Error("Nothing to parse");
    }
  }
};

export const manualParsing = () => {
  logseq.Editor.registerSlashCommand("Parse dates", async (e) => {
    const blk = await logseq.Editor.getBlock(e.uuid);
    if (!blk) return;
    const content = await inlineParsing(blk, { flag: "@" });
    if (content) await logseq.Editor.updateBlock(e.uuid, content);
  });

  logseq.Editor.registerSlashCommand("Parse scheduled", async (e) => {
    const blk = await logseq.Editor.getBlock(e.uuid);
    if (!blk) return;
    const content = await inlineParsing(blk, { flag: "%" });
    if (content) await logseq.Editor.updateBlock(e.uuid, content);
  });

  logseq.Editor.registerSlashCommand("Parse deadline", async (e) => {
    const blk = await logseq.Editor.getBlock(e.uuid);
    if (!blk) return;
    const content = await inlineParsing(blk, { flag: "^" });
    if (content) await logseq.Editor.updateBlock(e.uuid, content);
  });
};
