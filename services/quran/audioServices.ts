// getting words verses and audios
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WordVerseType } from "../lib/types/localVerseAndWordType";

// Helper to set the last downloaded page
const setLastDownloadedPage = async (pageNumber: number) => {
  await AsyncStorage.setItem("lastDownloadedAudio", pageNumber.toString());
};

export const fetchAndDownloadAudioForAllPages = async ({
  setIsLoadingAudios,
  setProgressAudio,
  TOTAL_PAGES,
  startPage,
}: {
  TOTAL_PAGES: number;
  setIsLoadingAudios: (isLoaded: boolean) => void;
  setProgressAudio: (currentNum: number) => void;
  startPage: number;
}) => {
  setIsLoadingAudios(true);

  try {
    let wordsVersesData: any[] = []; // Store words from all pages
    let audioUris: string[] = []; // Store local audio paths

    // Retrieve previously stored data
    const storedWordsVerses = await AsyncStorage.getItem("wordsVerses");
    if (storedWordsVerses) {
      wordsVersesData = JSON.parse(storedWordsVerses); // Load existing words and verses data
    }

    // Get the last downloaded page from storage
    const lastDownloadedPage = startPage;

    console.log(lastDownloadedPage);

    // Start from the last downloaded page
    for (
      let pageNumber = lastDownloadedPage;
      pageNumber <= lastDownloadedPage + TOTAL_PAGES;
      pageNumber++
    ) {
      const apiUrl = `https://quran.moaddi.org/hafs/all_apis/listen_level_1?page_number=${pageNumber}`;
      const response = await fetch(apiUrl);
      const wordsData = await response.json();
      console.log(wordsData);

      for (let i = 0; i < wordsData.length; i++) {
        const word = wordsData[i];
        const audioUrl = word.audio_url
          ? `https://audio.qurancdn.com/${word.audio_url}`
          : null;

        // Download the audio file if it exists
        if (audioUrl) {
          const audioPath = `${FileSystem.documentDirectory}/w${word.id}-v${word.verse_id}`;
          const fileInfo = await FileSystem.getInfoAsync(audioPath);
          console.log(audioPath);

          if (!fileInfo.exists) {
            // Download the audio file
            await FileSystem.downloadAsync(audioUrl, audioPath);
          }

          // Add the local audio path to the word data
          word.local_audio_path = audioPath;
          audioUris.push(audioPath); // Store the audio URI
        }

        // Add the word (with or without audio) to the data array
        wordsVersesData.push(word);

        // Update progress
        const currentProgress =
          (pageNumber - 1 + (i + 1) / wordsData.length) /
          (lastDownloadedPage + TOTAL_PAGES);
        setProgressAudio(currentProgress);
      }

      // Save the updated words data from each page periodically
      await AsyncStorage.setItem(
        "wordsVerses",
        JSON.stringify(wordsVersesData) // Save combined data (old + new)
      );

      // Save the current page as the last successfully downloaded page
      await setLastDownloadedPage(pageNumber);
    }

    setIsLoadingAudios(false);
    await AsyncStorage.removeItem("lastDownloadedAudio"); // Clear this if no resume is needed
    console.log("All words and audio files have been saved successfully.");
  } catch (error) {
    console.error("Error fetching or downloading audio data: ", error);
    setIsLoadingAudios(false);
  }
};

// Load offline words and audio data
export const loadWordsAndAudio = async ({ verseId }: { verseId: number }) => {
  try {
    const wordsVersesData = await AsyncStorage.getItem("wordsVerses");
    if (wordsVersesData) {
      const parsedData = JSON.parse(wordsVersesData);

      const wantedDate = parsedData.filter(
        (item: WordVerseType) => item.verse_id == verseId
      );
      console.log(wantedDate);

      return wantedDate;
    } else {
      console.log("No words and audio data found.");
      return [];
    }
  } catch (error) {
    console.error("Error loading words and audio data: ", error);
    return [];
  }
};

export const checkForDownloadedAudio = async ({
  setIsLoadingAudios,
  setProgressAudio,
  TOTAL_PAGES,
  startPage,
}: {
  TOTAL_PAGES: number;
  setIsLoadingAudios: (isLoaded: boolean) => void;
  setProgressAudio: (currentNum: number) => void;
  startPage: number;
}) => {
  setIsLoadingAudios(true);

  try {
    const downloadedAudioData = await AsyncStorage.getItem("wordsVerses");
    if (downloadedAudioData) {
      const parsedData = JSON.parse(downloadedAudioData);
      const downloadedAudioUris = parsedData.map(
        (word: any) => word.local_audio_path
      );

      // If all audio is downloaded, set the local audio URIs and verses
      setIsLoadingAudios(false);
    } else {
      // If no audio found in AsyncStorage, fetch and download them
      console.log("No downloaded audio found. Fetching audio...");
      await fetchAndDownloadAudioForAllPages({
        setIsLoadingAudios,
        setProgressAudio,
        TOTAL_PAGES,
        startPage,
      });
    }
  } catch (error) {
    console.error("Error checking for downloaded audio: ", error);
    setIsLoadingAudios(false);
  }
};

// getting words verses and audios
