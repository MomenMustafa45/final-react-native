import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveBookmark = async ({
  pageNumber,
  setBookmarks,
}: {
  pageNumber: number;
  setBookmarks?: (arr: []) => void;
}) => {
  try {
    // Retrieve current bookmarks from AsyncStorage
    const currentBookmarks = await AsyncStorage.getItem("bookmarks");
    let updatedBookmarks = currentBookmarks ? JSON.parse(currentBookmarks) : [];

    // Check if the bookmark already exists
    const bookmarkIndex = updatedBookmarks.findIndex(
      (bookmark: { pageNumber: number }) => bookmark.pageNumber === pageNumber
    );

    if (bookmarkIndex !== -1) {
      // Bookmark exists, so remove it
      updatedBookmarks.splice(bookmarkIndex, 1);
    } else {
      // Bookmark doesn't exist, so add it
      const newBookmark = { pageNumber };
      updatedBookmarks = [...updatedBookmarks, newBookmark];
    }

    // Update AsyncStorage and state with the updated bookmarks
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    if (setBookmarks) {
      setBookmarks(updatedBookmarks); // Update state
    }
    console.log("toggled");
  } catch (error) {
    console.error("Error toggling bookmark", error);
  }
};
