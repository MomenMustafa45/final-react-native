import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { WordVerseType } from "../../utils/qurantypes/localVerseAndWordType";

type ListenToAyahModal = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  verseModalData: WordVerseType[];
};

const ListenToAyahModal = ({
  modalVisible,

  setModalVisible,
  verseModalData,
}: ListenToAyahModal) => {
  const [sound, setSound] = useState<any>();
  const [wordAudioPath, setWordAudioPath] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState(0);
  const [listenNumber, setListenNumber] = useState(1);

  async function playSound() {
    try {
      console.log("Loading Sounds");

      if (wordAudioPath.length > 0) {
        for (let i = 0; i < wordAudioPath.length; i++) {
          const item = wordAudioPath[i];

          // Load and create the sound
          const { sound, status } = await Audio.Sound.createAsync({
            uri: item,
          });

          // Play the sound
          await sound.playAsync();

          // Get the duration of the audio in milliseconds
          // @ts-ignore
          const duration = status.durationMillis;

          if (duration) {
            // Use setTimeout to wait for the duration of the sound
            await new Promise((resolve) => setTimeout(resolve, duration));
          } else {
            console.log(`Unable to get duration for: ${item}`);
          }

          // Unload the sound to free resources
          await sound.unloadAsync();
        }
      }
    } catch (error) {
      // console.error("Error playing sound:", error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
          console.log("unloaded Sound");
        }
      : undefined;
  }, [sound]);

  const onWordPressedHandler = (item: WordVerseType, index: number) => {
    setFocusedId(item.id);
    if (listenNumber == 1) {
      setWordAudioPath([item.local_audio_path]);
    } else if (listenNumber == 2) {
      setWordAudioPath([
        item.local_audio_path,
        verseModalData[index + 1].local_audio_path,
      ]);
    } else {
      setWordAudioPath([]);
      verseModalData.forEach((item) => {
        setWordAudioPath((prev) => [...prev, item.local_audio_path]);
      });
    }
    console.log(wordAudioPath);
  };

  return (
    <>
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5} // Customize backdrop opacity
        onBackdropPress={() => {
          setModalVisible(false);
        }} // Close modal when clicking outside
        style={styles.modalContainer} // Apply styles for centering
        onModalHide={() => {
          setWordAudioPath([]);
          setFocusedId(0);
          setListenNumber(1);
        }}
      >
        <View style={styles.modalContent}>
          <View className="flex flex-row-reverse flex-wrap">
            {verseModalData?.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className=""
                onPress={() => {
                  onWordPressedHandler(item, index);
                }}
              >
                <Text
                  className={`mx-1 my-1 ${
                    focusedId == item.id ? "text-[#159C3E]" : "text-black"
                  }`}
                >
                  {item?.text_uthmani}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="my-4 flex flex-row items-center justify-center px-8">
            <AntDesign name="sound" size={24} color="#FDC92F" />
          </View>

          <View className="flex flex-row items-center justify-between w-full px-8">
            <TouchableOpacity
              className=" w-8 h-8"
              onPress={() => {
                setListenNumber(3);
                if (wordAudioPath.length > 0) {
                  playSound();
                }
              }}
            >
              <Image
                source={require("../../assets/quran/listenImgThree.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className=" w-8 h-8"
              onPress={() => {
                setListenNumber(2);
                if (wordAudioPath.length > 0) {
                  playSound();
                }
              }}
            >
              <Image
                source={require("../../assets/quran/listenImgTwo.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className=" w-8 h-8"
              onPress={() => {
                setListenNumber(1);
                if (wordAudioPath.length > 0) {
                  playSound();
                }
              }}
            >
              <Image
                source={require("../../assets/quran/listenOneImg.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ListenToAyahModal;

const styles = StyleSheet.create({
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
