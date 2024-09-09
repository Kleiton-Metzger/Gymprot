import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PDFReader from 'rn-pdf-reader-js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export const PdfViewer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uri, name } = route.params || {};

  const showToast = (message, type = 'success') => {
    Toast.show({
      type: type,
      text1: 'Atualização',
      text2: 'Aumente o percentual de inclinação da passadeira para 5%',
    });
  };

  const toastConfig = {
    success: ({ text1, text2 }) => (
      <View style={styles.toastSuccessContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    ),
    error: ({ text1, text2 }) => (
      <View style={styles.toastErrorContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    ),
    info: ({ text1, text2 }) => (
      <View style={styles.toastInfoContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    ),
  };

  if (!uri || !name) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Invalid parameters.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={styles.pdfContainer}>
        <PDFReader
          source={{ uri: uri }}
          onError={() => {
            showToast('Failed to load PDF', 'error');
          }}
          activityIndicatorColor="blue"
        />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => showToast('Previous Page')}>
          <MaterialCommunityIcons name="page-previous" size={40} color="black" />
          <Text>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => showToast('Next Page')}>
          <Text>Próximo</Text>
          <MaterialCommunityIcons name="page-next" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
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
    backgroundColor: 'gray',
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
  toastSuccessContainer: {
    backgroundColor: 'darkgray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
    width: '90%',
    height: 100,
  },
  toastErrorContainer: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
  },
  toastInfoContainer: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
  },
  toastText: {
    color: 'white',
    fontSize: 18,
  },
  toastTitle: {
    color: '#581DB9',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
