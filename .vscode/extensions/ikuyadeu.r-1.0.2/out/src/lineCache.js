"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to hold lines that have been fetched from the document after they have been preprocessed.
 */
class LineCache {
    constructor(getLine, lineCount) {
        this.getLine = getLine;
        this.lineCount = lineCount;
        this.lineCache = new Map();
        this.endsInOperatorCache = new Map();
    }
    getLineFromCache(line) {
        const lineInCache = this.lineCache.has(line);
        if (!lineInCache) {
            this.addLineToCache(line);
        }
        const s = this.lineCache.get(line);
        return (s);
    }
    getEndsInOperatorFromCache(line) {
        const lineInCache = this.lineCache.has(line);
        if (!lineInCache) {
            this.addLineToCache(line);
        }
        const s = this.endsInOperatorCache.get(line);
        return (s);
    }
    addLineToCache(line) {
        const cleaned = cleanLine(this.getLine(line));
        const endsInOperator = doesLineEndInOperator(cleaned);
        this.lineCache.set(line, cleaned);
        this.endsInOperatorCache.set(line, endsInOperator);
    }
}
exports.LineCache = LineCache;
function cleanLine(text) {
    const cleaned = text.replace(/\s*\#.*/, ""); // Remove comments and preceeding spaces
    return (cleaned);
}
function doesLineEndInOperator(text) {
    const endingOperatorIndex = text.search(/(,|\+|!|\$|\^|&|\*|-|=|:|\'|~|\||\/|\?|%.*%)(\s*|\s*\#.*)$/);
    const spacesOnlyIndex = text.search(/^\s*$/); // Space-only lines also counted.
    return ((0 <= endingOperatorIndex) || (0 <= spacesOnlyIndex));
}
//# sourceMappingURL=lineCache.js.map