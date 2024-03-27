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
    marginBottom: 20,
    top: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  searchBarClicked: {
    borderColor: "#581DB9",
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  cancelText: {
    marginLeft: 10,
    color: "#581DB9",
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    color: "#007AFF",
    fontSize: 16,
  },
  videoGridContainer: {
    marginTop: 20,
  },
  videoItem: {
    backgroundColor: "#ccc",
    width: 320,
    height: 200,
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
  },
  relatedVideosContainer: {
    marginTop: 10,
  },
  relatedVideo: {
    fontSize: 14,
    color: 'gray',
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
});

export default styles;
