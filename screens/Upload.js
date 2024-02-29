import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
//"react-native-vector-icons"


export default function Uploadcreen () {
  return (
      <View style={styles.container}>
          <Text style={styles.text}>Uploads</Text>  
          <Text style={styles.subtext}>Select the file you want to upload</Text>
        <View style={styles.container2}> 
          <TouchableOpacity style={styles.buttonContainer}
          onPress={() => alert('Video are not supported to Upload yet') }
          >
                    <Text style={styles.buttonText}>Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}
            onPress={() => alert('PDFs are not supported to Upload yet')}
            >
                    <Text style={styles.buttonText}>PDF</Text>
            </TouchableOpacity>
          </View>         
      </View>

      
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: "white",

  },
  container2: {
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor:'rgba(154, 151, 151, 1)',
    width: 350,
    height: "50%",
    position: 'absolute',
    top: "30%",
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 1,
},
  text: {
      color: '#161924', 
      fontSize: 40, 
      fontWeight: 'bold',
      color: '#161924', 
      position: 'absolute', 
      padding: "20%" ,
      top: 30,
  },
  subtext: {
    color: '#161924', 
    fontSize: 15, 
    color: '#161924', 
    position: 'absolute', 
    padding: "20%" ,
    top: 100,
},
  buttonContainer: {
      backgroundColor: 'rgba(88, 29, 185, 1)',
      padding: 15,
      width: 250,
      alignItems: 'center',
      borderRadius: 25,
      top: 20,
      borderColor: 'black',
      borderWidth: 1,
      marginBottom: 20,
  },
  buttonText: {
      color: 'white',
      fontSize: 20,
  },
  
});
