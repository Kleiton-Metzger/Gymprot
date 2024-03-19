
import { StyleSheet } from "react-native";

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    locationTxt: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 50,
      top: 40,
  
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f2f2f2",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#000000",
    },
    searchBarClicked: {
      borderColor: "#581DB9",
    },
    input: {
      flex: 1,
      marginLeft: 10,
    },
    cancelText: {
      marginLeft: 10,
      color: "#581DB9",
    },
    videoGridContainer: {
      marginTop: 20,
    },
    videoItem: {
      backgroundColor: "#ccc",
      width: 150,
      height: 150,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      borderRadius: 20,
      padding: 10,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    location: {
      fontSize: 14,
      color: 'gray',
      
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 25,
    },
    infoContainer: {
      flex: 1,
      margin: 5,
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#f2f2f2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    userInfo: {
      alignItems: 'center',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
    }
  });
  
export default styles;