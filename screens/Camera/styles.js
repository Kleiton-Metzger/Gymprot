import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  recordButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 35,
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
    top: '10%',
    left: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 'auto',
  },
  infoTextContainer: {
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    margin: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: '90%',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
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
    fontWeight: "bold",
    marginHorizontal: 10
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  descriptionInput: {
    marginVertical: 10,
    backgroundColor: 'white',
    height: 60,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressBar: {
  height: 10,
  backgroundColor: '#E0E0E0', 
  width: '100%',
  borderRadius: 5, 
  marginVertical: 10,
    
  },


});

