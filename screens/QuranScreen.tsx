import {
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";

import { useRoute } from "@react-navigation/native";
import {
  checkForDownloadedImages,
  getAreaTags,
} from "../services/quran/moshafPages";
import {
  checkForDownloadedAudio,
  fetchAndDownloadAudioForAllPages,
  loadWordsAndAudio,
} from "../services/quran/audioServices";
import { saveBookmark } from "../services/quran/bookmarkServices";
import { WordVerseType } from "../utils/qurantypes/localVerseAndWordType";
import CustomHeader from "../components/QuranComponents/CustomHeader";
import SearchModal from "../components/QuranComponents/SearchModal";
import ListenToAyahModal from "../components/QuranComponents/ListenToAyahModal";

// Define the range of pages
const TOTAL_PAGES = 604;

export type VerseType = {
  chapter_number: number;
  id: number;
  img_coords: string;
  img_url: string;
  page_number: number;
  text_imlaei_simple: string;
  verse_number: number;
};

const width = Dimensions.get("window").width;
const Home = () => {
  // data
  const [localImageUris, setLocalImageUris] = useState<string[]>([]);
  const [verses, setVerses] = useState<any[]>([]);
  const [wordsVerses, setWordsVerses] = useState<WordVerseType[]>([]);

  // progress percentage
  const [progressImages, setProgressImages] = useState(0); // For progress bar
  const [progressAudio, setProgressAudio] = useState(0); // For progress bar
  const [gettingMoreAudiosProgress, setGettingMoreAudiosProgress] = useState(0);
  // loading status
  const [isLoadingImages, setIsLoadingImages] = useState(true); // For loading indicator
  const [isLoadingAudios, setIsLoadingAudios] = useState(true); // For loading indicator
  const [isGettingMoreAudios, setIsGettingMoreAudios] = useState(false);
  const [isScrlling, setIsScrolling] = useState(false);
  // modals
  const [modalVisibleListen, setModalVisibleListen] = useState(false);
  const [modalVisibleSearch, setModalVisibleSearch] = useState(false);

  // ref
  const flatListRef = useRef<FlatList>(null);

  // route params

  let currentIndex = localImageUris.length - 1;

  // Fetch and download data
  useEffect(() => {
    if (localImageUris.length <= 0) {
      checkForDownloadedImages({
        setIsLoadingImages,
        setLocalImageUris,
        setVerses,
        setProgressImages,
        TOTAL_PAGES,
      });
    }

    // for audio
    checkForDownloadedAudio({
      setIsLoadingAudios,
      setProgressAudio,
      TOTAL_PAGES: 1,
      startPage: 1,
    });
  }, []);

  const handleBookmark = async (currentIndex: number) => {
    saveBookmark({ pageNumber: currentIndex }); // Saving bookmark with page number
  };

  // functions part
  // Function to scroll to a specific index in FlatList
  const scrollToIndex = (index: number) => {
    setIsScrolling(true);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 604 - index, // index of the item to scroll to
        animated: false,
        viewPosition: 0.5, // this positions the item in the middle of the screen
      });
    }
    setIsScrolling(false);
  };

  const getTheData = async (verseId: number, page_number: number) => {
    const wordsData = await loadWordsAndAudio({ verseId });

    if (wordsData.length == 0) {
      fetchAndDownloadAudioForAllPages({
        setIsLoadingAudios: setIsGettingMoreAudios,
        setProgressAudio: setGettingMoreAudiosProgress,
        startPage: page_number,
        TOTAL_PAGES: 1,
      });

      setModalVisibleListen(false);
    } else {
      setWordsVerses([...wordsData]);
      setModalVisibleListen(true);
    }
  };

  const handleWebViewMessage = async (event: any) => {
    const message = event.nativeEvent.data;
    try {
      const verseObject = JSON.parse(message); // Parse the full verse object
      // console.log("Received verse object:", verseObject);
      await getTheData(verseObject.id, verseObject.page_number);
    } catch (error) {
      console.warn("Failed to parse message:", message);
    }
  };

  // html
  const htmlContent = (imgUri: string, verses: any) => `
 <!DOCTYPE html>
 <html>
 <head>
   <style>
     body, html {
       height: 100%;
       width: 100%;
     }
     .image-container {
       position: relative;
       width: 100%;
       height: 100%;
     }
     img {
       width: 100%;
       height: 100%;
     }
   </style>
   <script src="https://unpkg.com/image-map-resizer@1.0.10/js/imageMapResizer.min.js"></script>
 </head>
 <body>
   <div class="image-container">
     <img src="${imgUri}" usemap="#workmap" />
     <map name="workmap">
       ${getAreaTags(verses)}
     </map>
   </div>
   <script>
     window.onload = function() {
       imageMapResize(); // Initialize image map resizer after the image loads

       // Add click event listeners to each area tag
       document.querySelectorAll('area').forEach(function(area) {
         area.addEventListener('click', function() {
           const verseData = area.getAttribute('data-verse');
           const verseObject = JSON.parse(verseData); // Parse the verse object
           window.ReactNativeWebView.postMessage(JSON.stringify(verseObject)); // Send the full verse object
         });
       });
     };
   </script>
 </body>
 </html>
`;

  // Scroll to the previous image (now points to the next in the reversed array)
  const goToPrevious = () => {};

  // Scroll to the next image (now points to the previous in the reversed array)
  const goToNext = () => {};

  if (isLoadingImages || isLoadingAudios) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#159C3E" />
        <Text>جاري تحميل البيانات...</Text>
        <Text>
          <>{Math.floor(progressImages * 100)}%</>
        </Text>
      </View>
    );
  }

  return (
    <>
      <CustomHeader setModalVisibleSearch={() => setModalVisibleSearch(true)} />
      <View
        className=" relative flex-1 bg-white"
        style={{ direction: "rtl", height: "100%" }}
      >
        {isGettingMoreAudios && (
          <View className=" absolute w-full h-full top-0 left-0 bg-[#f1f5f96e] z-50 justify-center items-center">
            <ActivityIndicator size="large" color="#159C3E" />
            <Text>Getting Sounds...</Text>
            <Text>
              <>{Math.floor(gettingMoreAudiosProgress * 100)}%</>
            </Text>
          </View>
        )}
        <View className="flex-1 my-1">
          {/* <View className="flex flex-row justify-between px-5 py-3 rounded-xl mx-3 bg-slate-200">
            <Text className="text-text-primary-green">البقرة</Text>
            <Text className="text-text-primary-green">½ الحزب 5</Text>
            <Text className="text-text-primary-green">الجزء 3</Text>
          </View> */}
          {/* pages */}
          <View className="flex-1 relative">
            {isScrlling && (
              <View className=" absolute top-0 left-0 w-full h-full z-50">
                <Text>Loading...</Text>
              </View>
            )}
            <FlatList
              ref={flatListRef} // Attach ref to FlatList
              pagingEnabled
              horizontal
              directionalLockEnabled={false}
              data={localImageUris}
              keyExtractor={(item, index) => String(index)}
              initialScrollIndex={localImageUris.length - 1} // Start from the last page
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / width
                );
                currentIndex = index;
                console.log(currentIndex);
              }}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={true}
              renderItem={({ item, index }) => (
                <View style={styles.webViewContainer}>
                  <WebView
                    allowFileAccess={true}
                    style={styles.container}
                    originWhitelist={["*"]}
                    source={{
                      html: htmlContent(
                        item,
                        verses[localImageUris.length - 1 - index]
                      ),
                    }}
                    onMessage={handleWebViewMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn("WebView error: ", nativeEvent);
                    }}
                  />
                </View>
              )}
            />
            {/* <View className="flex-row justify-center gap-x-4">
              <TouchableOpacity onPress={goToPrevious}>
                <FontAwesome5 name="arrow-left" size={24} color="#159C3E" />
              </TouchableOpacity>
              <View></View>
              <TouchableOpacity onPress={goToNext}>
                <FontAwesome5 name="arrow-right" size={24} color="#159C3E" />
              </TouchableOpacity>
            </View> */}
          </View>
          {/* end of page */}
        </View>

        {/* Search Modal */}
        <View className=" absolute w-full h-full left-0 right-0">
          <SearchModal
            modalVisible={modalVisibleSearch}
            setModalVisible={setModalVisibleSearch}
            goToPage={scrollToIndex}
          />
        </View>
        {/* Search Modal */}

        {/* listen Modal */}
        <ListenToAyahModal
          modalVisible={modalVisibleListen}
          setModalVisible={setModalVisibleListen}
          verseModalData={wordsVerses}
        />
        {/* listen modal */}
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "red",
    padding: 0,
    height: "100%",
    width: width,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 0,
  },
  modalContent: {
    width: "100%", // Set the modal width
    height: "auto", // Set the modal height
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
});
