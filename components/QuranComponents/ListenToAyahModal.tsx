import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { VerseType } from "../../screens/QuranScreen";

type ListenToAyahModal = {
  modalVisible: boolean;
  setVerseModal: (value: null | string) => void;
  setModalVisible: (value: boolean) => void;
  verseModal: VerseType | null;
};

const ListenToAyahModal = ({
  modalVisible,
  setVerseModal,
  setModalVisible,
  verseModal,
}: ListenToAyahModal) => {
  const [sound, setSound] = useState<any>();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../../../assets/images/song.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <>
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5} // Customize backdrop opacity
        onBackdropPress={() => {
          setVerseModal(null);
          setModalVisible(false);
        }} // Close modal when clicking outside
        style={styles.modalContainer} // Apply styles for centering
      >
        <View style={styles.modalContent}>
          <Text>
            <>{verseModal?.text_imlaei_simple}</>
          </Text>
          <View className="my-4 flex flex-row items-center justify-center px-8">
            <AntDesign name="sound" size={24} color="#FDC92F" />
          </View>

          <View className="flex flex-row items-center justify-between w-full px-8">
            <TouchableOpacity
              className=" w-8 h-8"
              onPress={() => {
                console.log("hello");
                playSound();
              }}
            >
              <Image
                source={require("../../../../assets/images/listenImgThree.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
            <TouchableOpacity className=" w-8 h-8">
              <Image
                source={require("../../../../assets/images/listenImgTwo.png")}
                className="w-full h-full"
              />
            </TouchableOpacity>
            <TouchableOpacity className=" w-8 h-8">
              <Image
                source={require("../../../../assets/images/listenOneImg.png")}
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
