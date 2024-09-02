import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const PdfViewer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uri, name } = route.params || {};

  const pdfRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!uri || !name) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Invalid parameters.</Text>
      </SafeAreaView>
    );
  }

  const handleNextPage = () => {
    if (pdfRef.current) {
      pdfRef.current.setPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pdfRef.current) {
      pdfRef.current.setPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={styles.pdfContainer}>
        <Pdf
          ref={pdfRef}
          source={{ uri: uri }}
          onLoadComplete={numberOfPages => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPage(page);
          }}
          onError={error => {
            alert('Failed to load PDF');
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
        />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePreviousPage} style={styles.controlButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="page-previous" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage} style={styles.controlButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="page-next" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdfContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgray',
  },
  backButton: {
    width: '15%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    width: '70%',
    textAlign: 'center',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  controlButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
});
