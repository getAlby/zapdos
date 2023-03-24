
import Filter from "bad-words";

// https://github.com/web-mech/badwords/issues/93
export class BadWordFilter extends Filter {
    cleanUtf8(string: string) {
      try {
        return this.clean(string);
      } catch {
        const joinMatch = this.splitRegex.exec(string);
        const joinString = (joinMatch && joinMatch[0]) || "";
        return string
          .split(this.splitRegex)
          .map((word) => {
            return this.isProfane(word) ? this.replaceWord(word) : word;
          })
          .join(joinString);
      }
    }
  }