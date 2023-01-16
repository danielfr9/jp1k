// Source: https://github.com/helephant/Gem

export type Furigana = {
  Expression: string;
  Hiragana: string;
  Reading: string;
  ReadingHtml: string;
};

export function Furigana(reading: string) {
  const segments = ParseFurigana(reading || "");

  const Reading = getReading();
  const Expression = getExpression();
  const Hiragana = getHiragana();
  const ReadingHtml = getReadingHtml();

  function getReading() {
    let reading = "";
    for (let x = 0; x < segments.length; x++) {
      reading += segments[x].Reading;
    }
    return reading.trim();
  }

  function getExpression() {
    let expression = "";
    for (let x = 0; x < segments.length; x++)
      expression += segments[x].Expression;
    return expression;
  }

  function getHiragana() {
    let hiragana = "";
    for (let x = 0; x < segments.length; x++) {
      hiragana += segments[x].Hiragana;
    }
    return hiragana;
  }

  function getReadingHtml() {
    let html = "";
    for (let x = 0; x < segments.length; x++) {
      html += segments[x].ReadingHtml;
    }
    return html;
  }

  return {
    Expression,
    Hiragana,
    Reading,
    ReadingHtml,
  };
}

function FuriganaSegment(baseText: string, furigana: string): Furigana {
  return {
    Expression: baseText,
    Hiragana: furigana.trim(),
    Reading: baseText + "[" + furigana + "]",
    ReadingHtml:
      "<ruby><rb>" + baseText + "</rb><rt>" + furigana + "</rt></ruby>",
  };
}

// It was a class
// this.Expression = baseText;
// this.Hiragana = baseText;
// this.Reading = baseText;
// this.ReadingHtml = baseText;
function UndecoratedSegment(baseText: string): Furigana {
  return {
    Expression: baseText,
    Hiragana: baseText,
    Reading: baseText,
    ReadingHtml: baseText,
  };
}

function ParseFurigana(reading: string) {
  const segments: Furigana[] = [];

  let currentBase = "";
  let currentFurigana = "";
  let parsingBaseSection = true;
  let parsingHtml = false;

  const characters = reading.split("");

  while (characters.length > 0) {
    let current = characters.shift();

    if (current === "[") {
      parsingBaseSection = false;
    } else if (current === "]") {
      nextSegment();
    } else if (
      isLastCharacterInBlock(current, characters) &&
      parsingBaseSection
    ) {
      currentBase += current;
      nextSegment();
    } else if (!parsingBaseSection) currentFurigana += current;
    else currentBase += current;
  }

  nextSegment();

  function nextSegment() {
    if (currentBase) segments.push(getSegment(currentBase, currentFurigana));
    currentBase = "";
    currentFurigana = "";
    parsingBaseSection = true;
    parsingHtml = false;
  }

  function getSegment(baseText: string, furigana: string) {
    if (!furigana || furigana.trim().length === 0)
      return UndecoratedSegment(baseText);
    return FuriganaSegment(baseText, furigana);
  }

  function isLastCharacterInBlock(
    current: string | undefined,
    characters: string[]
  ) {
    return (
      !characters.length ||
      (isKanji(current) !== isKanji(characters[0]) && characters[0] !== "[")
    );
  }

  function isKanji(character: string | undefined) {
    return (
      character &&
      character.charCodeAt(0) >= 0x4e00 &&
      character.charCodeAt(0) <= 0x9faf
    );
  }

  return segments;
}
