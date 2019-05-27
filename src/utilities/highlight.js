/* eslint-disable max-len */
/**
 * Renders highlighted phrases from a given string and an array of highlight objects.
 * @param {string} str
 * @param {array} highlights
 * @return {string}
 */
export function highlight(str, highlights) {
  let result = '';
  // input validity
  if (typeof str !== 'string') {
    throw new Error('String is expected');
  }
  if (!Array.isArray(highlights)) {
    throw new Error('Array is expected');
  }

  if (highlights.length === 0) {
    return str;
  }

  // sorting array of highlights by startOffset
  highlights.sort((a, b) => (a.startOffset < b.startOffset ? -1 : 0));
  let intersectionIdentifier = 1;

  // mapping array of rules, so if there is an overlap the lower priority text expands
  // or of the highlight with the lower priority (A) is wrapped with a highlight with a higher priority (B)
  // then the color of A = color of B
  for (let index = 0; index < highlights.length; index++) {
    const highlight = highlights[index];
    // Loop that handles overlaps and if any, adds property to highlight object - intersectionIdentifier
    for (
      let innerIndex = index + 1;
      innerIndex < highlights.length;
      innerIndex++
    ) {
      const nextHighlight = highlights[innerIndex];
      // Intersection
      if (nextHighlight.startOffset < highlight.endOffset) {
        highlight.isPartOfIntersection = highlight.isPartOfIntersection
          ? highlight.isPartOfIntersection
          : intersectionIdentifier;
        nextHighlight.isPartOfIntersection = highlight.isPartOfIntersection;
        // Expansion of a lower priority highlight
        if (nextHighlight.priority > highlight.priority) {
          // If a lower priority highlight is wrapped by a higher priority highlight
          if (
            nextHighlight.endOffset <= highlight.endOffset &&
            nextHighlight.startOffset >= highlight.startOffset
          ) {
            nextHighlight.color = highlight.color;
            nextHighlight.priority = highlight.priority;
          }
          nextHighlight.startOffset = highlight.startOffset;
        } else if (highlight.endOffset < nextHighlight.endOffset) {
          highlight.endOffset = nextHighlight.endOffset;
        }
      } else {
        intersectionIdentifier = intersectionIdentifier + 1;
      }
    }
  }

  const highlightsCopied = [...highlights];
  // Sorting array by endOffset
  highlightsCopied.sort((a, b) => (a.endOffset > b.endOffset ? -1 : 0));

  // Offset handling
  let intersectionFixIndex = 0;
  const intersectionFix = `<span style="background: #XXXXXX">`.length;
  let prevIntersectionIndex = undefined;

  // String modification / wrapping with spans
  for (let index = 0; index < highlightsCopied.length; index++) {
    const highlight = highlightsCopied[index];
    let {startOffset, endOffset, color, isPartOfIntersection} = highlight;
    // If current highlight a part of intersection, then calculate offset
    if (
      isPartOfIntersection &&
      prevIntersectionIndex === isPartOfIntersection
    ) {
      intersectionFixIndex = intersectionFixIndex + 1;
    } else {
      intersectionFixIndex = 0;
    }

    // Offset calculation
    prevIntersectionIndex = isPartOfIntersection;
    endOffset = endOffset + intersectionFix * intersectionFixIndex;
    startOffset = startOffset + intersectionFix * intersectionFixIndex;

    // String modification
    str = [str.slice(0, endOffset), `</span>`, str.slice(endOffset)].join('');
    str = [
      str.slice(0, startOffset),
      `<span style="background: ${color}">`,
      str.slice(startOffset),
    ].join('');
  }
  result = str;
  return result;
}
