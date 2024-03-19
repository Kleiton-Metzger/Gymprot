import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import styles from '../styles';
import { Feather } from "@expo/vector-icons";



export const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked }) => {
   
  
  
  return (
        <View style={[styles.searchBar, clicked && styles.searchBarClicked]}>
          <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />
          <TextInput
            style={styles.input}
            placeholder="Search by location"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onFocus={() => setClicked(true)}
          />
          {clicked && (
            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setClicked(false); setSearchPhrase(''); }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      );
  };

  