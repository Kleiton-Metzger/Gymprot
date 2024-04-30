import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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
    margin: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    alignSelf: 'center',
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
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    zIndex: 0,
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
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
    marginBottom: 10,
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
    left: '50%',
    top: '50%',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 5,
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
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 30,
  },
});

export default styles;
