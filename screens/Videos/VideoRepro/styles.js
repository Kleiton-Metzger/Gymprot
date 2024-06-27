import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginLeft: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    marginTop: 20,
  },
  sensorContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sensorItem: {
    flexDirection: 'row',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  sensorLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  sensorData: {
    fontWeight: 'normal',
  },
  modalContent: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalCloseButton: {
    marginBottom: 15,
  },
  modalCloseText: {
    color: '#581DB9',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 10,
    backgroundColor: 'white',
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
  video: {
    width,
    height: 300,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  machineDataContainer: {
    width,
    padding: 10,
    flexDirection: 'row',
  },
  machineDataItem: {
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '50%',
  },
  machineDataLabel: {
    fontWeight: 'bold',
  },
  machineDataValue: {
    fontWeight: 'normal',
  },
  machineDataTitle: {
    fontWeight: 'bold',
  },
  machineDataname: {
    fontWeight: 'normal',
    borderRadius: 5,
  },
});
