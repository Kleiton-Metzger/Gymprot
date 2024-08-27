import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoItem: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#581DB9',
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
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
    paddingBottom: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoGridContainer: {
    paddingBottom: 80,
  },
  vidoeOptionsContainer: {
    flexDirection: 'row',
    width: '25%',
    position: 'absolute',
    right: 0,
    top: 0,
    marginTop: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 10,
  },
  deleteVideo: {
    padding: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionInput: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalButton: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    top: '40%',
  },
  confirmationModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 15,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  videoItemContainer: {
    marginBottom: 20,
    width: '100%',
  },
  videoInfoContainer: {
    position: 'absolute',
    padding: 10,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 5,
    bottom: 0,
    alignItems: 'center',
  },
  videoLocation: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: 'black',
    marginLeft: 5,
  },
});

export default styles;
