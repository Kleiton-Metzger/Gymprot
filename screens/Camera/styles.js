import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent'    
    },
    camera: {
      flex: 1,
      justifyContent: 'space-between',
      position: 'relative',
    },
    recordButton: { 
      position: 'absolute',
      bottom: 80,
      alignSelf: 'center',
      alignItems: 'center',
      height: 80,
      width: 80,
      borderRadius: 35, 
      bordercolor: 'black',
      borderWidth: 3,
    },
    timerContainer: {
      position: 'absolute',
      top: "5%",
      alignSelf: 'center',
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 10,
    },
    timerText: {
      fontSize: 18,
      color: 'white',
    },
    infoContainer: {
      position: 'absolute', 
      top: "10%",
      left: 0,
      padding: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
      width: 'auto' 
    },
    infoTextContainer: {
      justifyContent: 'center',
    },
    infoText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
      margin: 5,
    },
    iconcam: {
      color: '#161924', 
      position: 'absolute',   
      right: 0,
      padding: 15,
      top: 10,
      fontSize: 40,
    },
    
  });
export default styles;  