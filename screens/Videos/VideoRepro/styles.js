import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%',
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
    width: width,
    height: height,
  },
  dataContainer: {
    position: 'absolute',
    top: 20,
    width: width,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  dataText: {
    color: 'white',
    fontSize: 15,
  },
});
