import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const getAreaTags = (verses: []) => {
  return verses
    .map(
      (verse: {
        img_coords: string;
        verse_number: number;
        text_imlaei_simple: string;
      }) => `
      <area shape="poly" coords="${verse.img_coords}" alt="Verse ${
        verse.verse_number
      }" data-verse='${JSON.stringify(verse)}' />
      `
    )
    .join(""); // Join all the areas into a single string
};

export const setUrisWithChunks = async ({
  limit,
  start,
}: {
  limit: number;
  start: number;
}) => {
  const downloadedPagesData = await AsyncStorage.getItem(
    "downloadedQuranPages"
  );
  let chunksUris: string[] = [];
  let chunksVerses: any[] = [];
  if (downloadedPagesData) {
    const downloadedPages = JSON.parse(downloadedPagesData);

    for (let i = start; i < start + limit; i++) {
      const imagePath = `${FileSystem.documentDirectory}quran-page-${downloadedPages[i]}.jpg`;
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      if (fileInfo.exists) {
        chunksUris.push(imagePath); // Store the content URI instead of file path

        // Load verses from file system
        const versesPath = `${FileSystem.documentDirectory}quran-page-${downloadedPages[i]}-verses.json`;
        const versesFile = await FileSystem.readAsStringAsync(versesPath);
        chunksVerses.push(JSON.parse(versesFile));
      }
    }
  }
  return { chunksUris, chunksVerses };
};

// fetch first time uris and images
export const fetchAndDownloadImages = async ({
  setIsLoading,
  setLocalImageUris,
  setVerses,
  setProgress,
  TOTAL_PAGES,
}: {
  TOTAL_PAGES: number;
  setIsLoading: (isLoaded: boolean) => void;
  setProgress: (currentNum: number) => void;
  setLocalImageUris: (arr: any[]) => void;
  setVerses: (arr: any[]) => void;
}) => {
  setIsLoading(true);

  try {
    let downloadedPages = [];
    let imageUris: string[] = [];
    let versesData: any[] = [];
    let currentProgress = 0;

    // Loop over all page numbers
    for (let pageNumber = 1; pageNumber <= TOTAL_PAGES; pageNumber++) {
      const apiUrl = `https://quran.moaddi.org/hafs/all_apis/img_coords?page_number=${pageNumber}`;

      // Fetch data from API
      const response = await fetch(apiUrl);
      const pageData = await response.json();

      if (pageData.length > 0) {
        const imgUrl = pageData[0].img_url;

        // Download the image
        const filePath = `${FileSystem.documentDirectory}quran-page-${pageNumber}.jpg`;
        await FileSystem.downloadAsync(imgUrl, filePath);

        // Save the verses data to a file
        const versesPath = `${FileSystem.documentDirectory}quran-page-${pageNumber}-verses.json`;
        await FileSystem.writeAsStringAsync(
          versesPath,
          JSON.stringify(pageData)
        );

        imageUris.push(filePath); // Store the content URI instead of file path
        versesData.push(pageData); // Store the verse data

        // Keep track of downloaded pages
        downloadedPages.push(pageNumber);

        // Update progress (percentage)
        currentProgress = pageNumber / TOTAL_PAGES;
        setProgress(currentProgress);
      }
    }

    // Save downloaded pages metadata to AsyncStorage
    await AsyncStorage.setItem(
      "downloadedQuranPages",
      JSON.stringify(downloadedPages)
    );

    const { chunksUris, chunksVerses } = await setUrisWithChunks({
      limit: 604,
      start: 0,
    });
    // Update the state with image URIs and verses
    setLocalImageUris([...chunksUris.reverse()]);
    setVerses(chunksVerses);
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching or downloading data: ", error);
    setIsLoading(false);
  }
};

export const checkForDownloadedImages = async ({
  setIsLoading,
  setLocalImageUris,
  setVerses,
  setProgress,
  TOTAL_PAGES,
}: {
  TOTAL_PAGES: number;
  setIsLoading: (isLoaded: boolean) => void;
  setProgress: (currentNum: number) => void;
  setLocalImageUris: (arr: any[]) => void;
  setVerses: (arr: any[]) => void;
}) => {
  setIsLoading(true);

  try {
    const downloadedPagesData = await AsyncStorage.getItem(
      "downloadedQuranPages"
    );

    if (downloadedPagesData) {
      const downloadedPages = JSON.parse(downloadedPagesData);

      // let imageUris: string[] = [];
      // let versesData: any[] = [];

      // for (let i = 0; i < 5; i++) {
      //   const imagePath = `${FileSystem.documentDirectory}quran-page-${downloadedPages[i]}.jpg`;
      //   const fileInfo = await FileSystem.getInfoAsync(imagePath);
      //   if (fileInfo.exists) {
      //     // Convert file path to content URI for better compatibility with WebView
      //     const contentUri = await FileSystem.getContentUriAsync(imagePath);
      //     imageUris.push(contentUri); // Store the content URI instead of file path

      //     // Load verses from file system
      //     const versesPath = `${FileSystem.documentDirectory}quran-page-${downloadedPages[i]}-verses.json`;
      //     const versesFile = await FileSystem.readAsStringAsync(versesPath);
      //     versesData.push(JSON.parse(versesFile));
      //   }
      // }

      //   // Loop through downloaded pages and load data from file system
      //   for (let page of downloadedPages) {
      //     const imagePath = `${FileSystem.documentDirectory}quran-page-${page}.jpg`;
      //     const fileInfo = await FileSystem.getInfoAsync(imagePath);

      //     if (fileInfo.exists) {
      //       // Convert file path to content URI for better compatibility with WebView
      //       const contentUri = await FileSystem.getContentUriAsync(imagePath);
      //       imageUris.push(contentUri); // Store the content URI instead of file path

      //       // Load verses from file system
      //       const versesPath = `${FileSystem.documentDirectory}quran-page-${page}-verses.json`;
      //       const versesFile = await FileSystem.readAsStringAsync(versesPath);
      //       versesData.push(JSON.parse(versesFile));
      //     }
      //   }
      const { chunksUris, chunksVerses } = await setUrisWithChunks({
        limit: 604,
        start: 0,
      });

      setLocalImageUris([...chunksUris.reverse()]);
      setVerses(chunksVerses);
      setIsLoading(false);
    } else {
      // If no images found in AsyncStorage, fetch and download them
      fetchAndDownloadImages({
        setProgress,
        setIsLoading,
        TOTAL_PAGES,
        setLocalImageUris,
        setVerses,
      });
    }
  } catch (error) {
    console.error("Error checking for downloaded images: ", error);
    setIsLoading(false);
  }
};
