import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '30%',
  },
  recordButton: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
    borderColor: 'black',
    borderWidth: 3,
  },
  timerContainer: {
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 18,
    color: 'white',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    marginVertical: 4,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: '90%',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },

  button: {
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
  },
  descriptionInput: {
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#581DB9',
    borderRadius: 5,
  },
});
