import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bckButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#581DB9',
    borderWidth: 2,
    marginBottom: 10,
  },
  userFollow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seguidoresContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  segdrTxt: {
    color: 'darkgray',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  segdrNum: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    width: 100,
    marginHorizontal: 10,
  },
  bioContainer: {
    padding: 15,
    width: '100%',
    backgroundColor: 'white',
  },
  bioText: {
    fontSize: 14,
    color: '#818589',
    textAlign: 'justify',
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  userNameU: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  avatarUser: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'darkgray',
  },
  infoContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  videoGridContainer: {
    paddingBottom: 80,
  },
  videoItem: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoItemContainer: {
    marginBottom: 20,
    width: '100%',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
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
  commentSection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  commentInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  commentContainer: {
    marginBottom: 5,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 2,
  },
  commentList: {
    paddingBottom: 10,
  },
});

export { styles };
