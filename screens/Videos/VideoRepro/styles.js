import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const commonButtonStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: 30,
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  screenContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: '#555',
    borderRadius: 25,
    height: 55,
  },
  filterIcon: {
    width: width * 0.25,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    top: 10,
  },
  filterImage: {
    width: 30,
    height: 30,
  },
  headerButton: {
    padding: 10,
    ...commonButtonStyles,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseButton: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: 30 }],
    padding: 15,
    ...commonButtonStyles,
    zIndex: 1,
  },

  controlsContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  seekButton: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 20,
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  videoTimeline: {
    width: '60%',
    height: 30,
  },
  volumeControlContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
  volumeControl: {
    width: width * 0.13,
    marginTop: 10,
  },
  speedometerControlContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  playbackRatesContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  speedometerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    right: 10,
  },
  playbackRateButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  activePlaybackRateButton: {
    backgroundColor: '#581DB9',
  },
  inactivePlaybackRateButton: {
    backgroundColor: 'white',
  },
  playbackRateText: {
    color: 'wihte',
    fontSize: 16,
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    zIndex: 2,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  toggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    top: 3,
  },
  activeButton: {
    backgroundColor: '#581DB9',
  },
  inactiveButton: {
    backgroundColor: '#555',
  },
});
