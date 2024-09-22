import {
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { checkForDownloadedImages } from "../services/QuranServices";
import WebView from "react-native-webview";
import { htmlContent } from "../components/QuranComponents/HtmlContent";
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

const QuranScreen = () => {
  const [localImageUris, setLocalImageUris] = useState<string[]>([]);
  const [verses, setVerses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For loading indicator
  const carouselRef = useRef<any>(null); // Reference to the carousel
  const [currentIndex, setCurrentIndex] = useState(0); // Track current index
  const [progress, setProgress] = useState(0); // For progress bar
  const [modalVisible, setModalVisible] = useState(false);
  const [verseModal, setVerseModal] = useState<VerseType | null>(null);

  // Fetch and download data
  useEffect(() => {
    if (localImageUris.length <= 0) {
      checkForDownloadedImages({
        setIsLoading,
        setLocalImageUris,
        setVerses,
        setProgress,
        TOTAL_PAGES,
      });
    }
  }, []);

  const handleWebViewMessage = (event: any) => {
    const message = event.nativeEvent.data;
    try {
      const verseObject = JSON.parse(message); // Parse the full verse object
      console.log("Received verse object:", verseObject);
      setVerseModal({ ...verseObject });
      setModalVisible(true);
    } catch (error) {
      console.warn("Failed to parse message:", message);
    }
  };

  // Scroll to the previous image (now points to the next in the reversed array)
  const goToPrevious = () => {
    if (currentIndex < localImageUris.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ index: currentIndex + 1 });
      }
      console.log(currentIndex);
    }
  };

  // Scroll to the next image (now points to the previous in the reversed array)
  const goToNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ index: currentIndex - 1 });
      }
      console.log(currentIndex);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#159C3E" />
        <Text>Downloading Quran pages...</Text>
        <Text>
          <>{Math.floor(progress * 100)}%</>
        </Text>
      </View>
    );
  }

  return (
    <View className=" relative flex-1 bg-white" style={{ direction: "rtl" }}>
      <View className="flex-1 my-1">
        {/* <View className="flex flex-row justify-between px-5 py-3 rounded-xl mx-3 bg-slate-200">
            <TextReg className="text-text-primary-green">البقرة</TextReg>
            <TextReg className="text-text-primary-green">½ الحزب 5</TextReg>
            <TextReg className="text-text-primary-green">الجزء 3</TextReg>
          </View> */}
        {/* pages */}
        <View className="flex-1">
          <FlatList
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
              setCurrentIndex(index);
              console.log(index);
            }}
            initialNumToRender={5}
            removeClippedSubviews={true} // Improve memory usage by clipping offscreen items
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
                  }} // Pass the HTML content to WebView
                  onMessage={handleWebViewMessage} // Handle messages from the WebView
                  javaScriptEnabled={true} // Ensure JavaScript is enabled
                  domStorageEnabled={true} // Enable DOM storage if necessary
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
      {/* Modal */}
      <ListenToAyahModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setVerseModal={() => setVerseModal(null)}
        verseModal={verseModal}
      />
      {/* modal */}
    </View>
  );
};

export default QuranScreen;

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
