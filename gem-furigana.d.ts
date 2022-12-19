declare module "gem-furigana" {
  declare class Furigana {
    Reading: string;
    Expression: string;
    Hiragana: string;
    ReadingHtml: string;

    constructor(reading: string);
  }
}
