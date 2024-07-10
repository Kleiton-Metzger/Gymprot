import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recordButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
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
    backgroundColor: '#F0F0F0', // Fundo cinza claro para input
    height: 80, // Altura aumentada para melhor usabilidade
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
