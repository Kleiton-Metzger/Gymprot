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
    bottom: height * 0.4,
    left: '50%',
    transform: [{ translateX: -30 }],
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
    ...commonButtonStyles,
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
    width: width * 0.2,
  },
  speedometerControlContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    alignItems: 'center',
  },
  speedometer: {
    marginBottom: 5,
  },
  speedometerControl: {
    width: width * 0.2,
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
});
