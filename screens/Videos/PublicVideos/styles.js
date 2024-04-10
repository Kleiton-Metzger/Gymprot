import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },  
  videoGridContainer: {
    marginTop: 20,
  },
  videoItem: {
    backgroundColor: "#ccc",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  
  location: {
    fontSize: 14,
    color: 'gray',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  tipo: {
    fontSize: 14,
    color: 'gray',
  },
  video: {
    width: 300,
    height: "100%",
    borderRadius: 20,
  }, 

});

export default styles;
