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
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '95%',
    marginBottom: '25%',
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
});
