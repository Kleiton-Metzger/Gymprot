import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },
  backBtn: {
    marginLeft: 10,
  },
  activityIndicator: {
    position: 'absolute',
    top: height / 2,
    left: width / 2,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '90%',
  },
  dataContainer: {
    position: 'absolute',
    top: 25,
    right: 5,
    width: '80%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  dataText: {
    color: 'white',
    fontSize: 15,
  },
  playPauseButton: {
    position: 'absolute',
    top: 25,
    zIndex: 1,
    right: '45%',
    backgroundColor: '#581DB9',
    padding: 10,
    borderRadius: 50,
  },
  playPauseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
