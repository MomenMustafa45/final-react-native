import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchType } from "../lib/types/searchDataType";

const FILE_NAME = "searchData.json";

// Helper to store large data in the file system
const saveSearchDataToFileSystem = async (data: SearchType[]) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    return fileUri;
  } catch (error) {
    console.error("Error saving search data to file system: ", error);
    throw error;
  }
};

// Helper to load large data from the file system
const loadSearchDataFromFileSystem = async () => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;
    const fileData = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error loading search data from file system: ", error);
    return [];
  }
};

// Fetch and store data from the search API
export const fetchAndStoreSearchData = async ({
  setIsLoading,
  setDataSearch,
}: {
  setIsLoading: (isLoaded: boolean) => void;
  setDataSearch: (arr: SearchType[]) => void;
}) => {
  setIsLoading(true);

  try {
    let searchData: SearchType[] = []; // Store data from the API

    // API URL
    const apiUrl = `https://quran.moaddi.org/hafs/all_apis/search_api`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);

    searchData.push(...data);

    // Save the data to the file system
    const fileUri = await saveSearchDataToFileSystem(searchData);

    // Store the file URI in AsyncStorage
    await AsyncStorage.setItem("searchDataFileUri", fileUri);

    // Set the data for your component
    setDataSearch(searchData);

    setIsLoading(false);
    console.log("All search data has been saved successfully.");
  } catch (error) {
    console.error("Error fetching or storing search data: ", error);
    setIsLoading(false);
  }
};

// Load offline search data from the file system
export const loadSearchData = async () => {
  try {
    const searchData = await loadSearchDataFromFileSystem();
    console.log(searchData);
    return searchData;
  } catch (error) {
    console.error("Error loading search data: ", error);
    return [];
  }
};

// Check for stored search data and fetch if not found
export const checkForStoredSearchData = async ({
  setIsLoading,
  setDataSearch,
}: {
  setIsLoading: (isLoaded: boolean) => void;
  setDataSearch: (arr: SearchType[]) => void;
}) => {
  setIsLoading(true);

  try {
    // Retrieve the file URI from AsyncStorage
    const storedFileUri = await AsyncStorage.getItem("searchDataFileUri");

    if (storedFileUri) {
      console.log("Search data found in file system.");
      const searchData = await loadSearchDataFromFileSystem();
      setDataSearch(searchData);
    } else {
      // If no stored data, fetch and store it
      console.log("No search data found. Fetching from API...");
      await fetchAndStoreSearchData({
        setIsLoading,
        setDataSearch,
      });
    }

    setIsLoading(false);
  } catch (error) {
    console.error("Error checking for stored search data: ", error);
    setIsLoading(false);
  }
};
