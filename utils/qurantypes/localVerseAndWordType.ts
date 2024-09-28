export type WordVerseType = {
  audio_url: string;
  chapter_id: number;
  id: number;
  local_audio_path: string;
  text_uthmani: string;
  verse_id: number;
};

export type VerseType = {
  chapter_number: number;
  id: number;
  img_coords: string;
  img_url: string;
  page_number: number;
  text_imlaei_simple: number;
  verse_number: number;
};
