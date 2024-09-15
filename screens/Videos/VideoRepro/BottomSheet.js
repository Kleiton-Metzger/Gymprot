import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useAuth } from '../../../Hooks/useAuth';
import { db } from '../../../storage/Firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Menu, Button } from 'react-native-paper';
import PDFReader from 'rn-pdf-reader-js';

const CustomBottomSheet = ({ isVisible }) => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '60%', '90%'], []);

  useEffect(() => {
    if (currentUser) {
      const documentsCollection = collection(db, 'documents');
      const q = query(documentsCollection, where('createdBy', '==', currentUser.userId));

      const unsubscribe = onSnapshot(q, snapshot => {
        const documentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          label: doc.data().name,
          uri: doc.data().uri,
          ...doc.data(),
        }));
        setDocuments(documentsData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleSheetChanges = useCallback(index => {
    console.log('BottomSheet alterado para a posição:', index);
  }, []);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  if (!isVisible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      index={0}
      style={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>Escolha um Documento</Text>

          <Menu
            theme={{ colors: { surface: 'white' } }}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="outlined" onPress={openMenu}>
                {selectedDocument ? selectedDocument.label : 'Escolha um Documento'}
              </Button>
            }
          >
            {documents.map(doc => (
              <Menu.Item
                style={{ backgroundColor: 'white' }}
                key={doc.id}
                onPress={() => {
                  setSelectedDocument(doc);
                  closeMenu();
                  console.log('Documento selecionado:', doc);
                }}
                title={doc.label}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.pdfContainer}>
          {selectedDocument ? (
            <PDFReader
              source={{ uri: selectedDocument.uri }}
              onError={() => {
                Alert.alert('Erro', 'Falha ao carregar o PDF');
              }}
              activityIndicator={<ActivityIndicator size="large" color="#0000ff" />}
            />
          ) : (
            <Text style={styles.noDocumentText}>Selecione um documento para visualizar.</Text>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  noDocumentText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CustomBottomSheet;
