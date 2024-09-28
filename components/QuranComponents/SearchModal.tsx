import Modal from "react-native-modal";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SearchType } from "../../utils/qurantypes/searchDataType";
import { checkForStoredSearchData } from "../../services/quran/searchServices";

type SearchModalProps = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  goToPage: (index: number) => void;
};

const SearchModal = ({
  modalVisible,
  setModalVisible,
  goToPage,
}: SearchModalProps) => {
  const [searchData, setSearchData] = useState<SearchType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filteredData, setFilteredData] = useState<SearchType[]>([]);

  useEffect(() => {
    // Fetch stored or API data when the modal opens
    checkForStoredSearchData({
      setIsLoading: setIsLoadingData,
      setDataSearch: setSearchData,
    });
  }, []);

  // Function to handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      // Filter data based on search term (partial match)
      const searchedAyat = searchData.filter(
        (item) => item.text_imlaei_simple.includes(searchTerm) // Partial match
      );
      setFilteredData(searchedAyat);
    } else {
      setFilteredData([]); // If the input is empty, clear the results
    }
  };

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.5}
      onBackdropPress={() => setModalVisible(false)}
      style={styles.modalContainer}
    >
      {isLoadingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#159C3E" />
          <Text>Downloading Data...</Text>
        </View>
      ) : (
        <View style={styles.modalContent}>
          <View className="flex flex-row items-center">
            <Button title="ابحث" onPress={handleSearch} color="#22c55e" />

            <TextInput
              style={styles.input}
              placeholder="ادخل الكلمة"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Text style={styles.count}>{filteredData.length} آيات</Text>
          </View>

          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  goToPage(item.page_number);
                  setModalVisible(false);
                }}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#0CB697",
                  marginBottom: 5,
                }}
              >
                <Text style={styles.ayat}>{item.text_uthmani}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
  modalContent: {
    width: "70%",
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    textAlign: "right",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    margin: 10,
  },
  count: {
    fontSize: 16,
  },
  list: {
    width: "100%",
  },
  ayat: {
    fontSize: 16,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchModal;
