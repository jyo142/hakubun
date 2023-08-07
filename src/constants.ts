export const ASSIGNMENT_BATCH_SIZES = [
  1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
];

export const INVALID_ANSWER_CHARS = new RegExp(
  /.*[!@#%^&*()_+=[\]{}\|;:",\\/<>\~`].*/,
  "g"
);

export const TAG_REGEXES = {
  radRegEx: new RegExp(`<radical>(.+?)<\/radical>`, "g"),
  kanjiRegEx: new RegExp(`<kanji>(.+?)<\/kanji>`, "g"),
  vocabRegEx: new RegExp(`<vocabulary>(.+?)<\/vocabulary>`, "g"),
  readingRegEx: new RegExp(`<reading>(.+?)<\/reading>`, "g"),
  meaningRegEx: new RegExp(`<meaning>(.+?)<\/meaning>`, "g"),
  japaneseRegEx: new RegExp(`<ja>(.+?)<\/ja>`, "g"),
  japaneseReadingRegEx: new RegExp(`<reading><ja>(.+?)<\/ja><\/reading>`, "g"),
};
