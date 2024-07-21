import React, { useState, useEffect } from 'react';
import { View, Switch, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { TextInput, List } from 'react-native-paper';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../storage/Firebase';
import { useAuth } from '../Hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfigurationModal = ({
  isVisible,
  onClose,
  bicycleName: initialBicycleName,
  setBicycleName,
  treadmillName: initialTreadmillName,
  setTreadmillName,
  inclination: initialInclination,
  setInclination,
  maxSpeed: initialMaxSpeed,
  setMaxSpeed,
  onStart,
  type,
}) => {
  const [nameError, setNameError] = useState('');
  const [inclinationError, setInclinationError] = useState('');
  const [maxSpeedError, setMaxSpeedError] = useState('');
  const [savedMachines, setSavedMachines] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSavedMachines = async () => {
      if (currentUser && currentUser.userId) {
        try {
          const userDocRef = doc(db, 'users', currentUser.userId);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();

          if (userData && userData.machines && Array.isArray(userData.machines)) {
            setSavedMachines(userData.machines);
          }
        } catch (error) {
          console.error('Error fetching saved machines:', error);
        }
      }
    };

    fetchSavedMachines();
  }, [currentUser]);

  const validateInputs = () => {
    let isValid = true;

    if (type === 'Cycling' && !initialBicycleName.trim()) {
      setNameError('O nome ou modelo da bicicleta é obrigatório');
      isValid = false;
    } else if (type !== 'Cycling' && !initialTreadmillName.trim()) {
      setNameError('Indique marca ou modelo da passadeira');
      isValid = false;
    } else {
      setNameError('');
    }

    if (type !== 'Cycling' && (!initialInclination || isNaN(initialInclination))) {
      setInclinationError('Indique a inclinação máxima da passadeira');
      isValid = false;
    } else {
      setInclinationError('');
    }

    if (!initialMaxSpeed || isNaN(initialMaxSpeed)) {
      setMaxSpeedError(
        type === 'Cycling'
          ? 'O nível máximo de ajuste de dificuldade é obrigatório'
          : 'Indique a velocidade máxima da passadeira',
      );
      isValid = false;
    } else {
      setMaxSpeedError('');
    }

    return isValid;
  };

  const handleStart = () => {
    if (validateInputs()) {
      onStart();
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleSaveMachineData = async () => {
    if (validateInputs() && currentUser && currentUser.userId) {
      try {
        const userDocRef = doc(db, 'users', currentUser.userId);
        let newMachineConfig = {};
        if (type !== 'Cycling') {
          newMachineConfig = {
            name: initialTreadmillName,
            inclination: Number(initialInclination),
            maxSpeed: Number(initialMaxSpeed),
            type: 'Treadmill',
          };
        } else {
          newMachineConfig = {
            name: initialBicycleName,
            maxResistance: Number(initialMaxSpeed),
            type: 'Bicycle',
          };
        }

        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        let updatedMachines = [];
        if (userData && userData.machines && Array.isArray(userData.machines)) {
          updatedMachines = [...userData.machines];
        }

        const machineIndex = updatedMachines.findIndex(m => {
          if (newMachineConfig.type === 'Treadmill') {
            return m.Treadmill && m.Treadmill.name === newMachineConfig.name;
          } else if (newMachineConfig.type === 'Bicycle') {
            return m.Bicycle && m.Bicycle.name === newMachineConfig.name;
          }
        });

        if (isDefault) {
          updatedMachines = updatedMachines.map(machine => {
            if (newMachineConfig.type === 'Treadmill' && machine.Treadmill) {
              return { ...machine, Treadmill: { ...machine.Treadmill, isDefault: false } };
            } else if (newMachineConfig.type === 'Bicycle' && machine.Bicycle) {
              return { ...machine, Bicycle: { ...machine.Bicycle, isDefault: false } };
            }
            return machine;
          });
        }

        if (machineIndex > -1) {
          if (newMachineConfig.type === 'Treadmill') {
            updatedMachines[machineIndex].Treadmill = {
              name: newMachineConfig.name,
              inclination: newMachineConfig.inclination,
              maxSpeed: newMachineConfig.maxSpeed,
              isDefault,
            };
          } else if (newMachineConfig.type === 'Bicycle') {
            updatedMachines[machineIndex].Bicycle = {
              name: newMachineConfig.name,
              maxResistance: newMachineConfig.maxResistance,
              isDefault,
            };
          }
        } else {
          updatedMachines.push({
            [newMachineConfig.type]: {
              name: newMachineConfig.name,
              ...(newMachineConfig.type === 'Treadmill' && { inclination: newMachineConfig.inclination }),
              ...(newMachineConfig.type === 'Treadmill' && { maxSpeed: newMachineConfig.maxSpeed }),
              ...(newMachineConfig.type === 'Bicycle' && { maxResistance: newMachineConfig.maxResistance }),
              isDefault,
            },
          });
        }

        await updateDoc(userDocRef, {
          machines: updatedMachines,
        });

        console.log('Machine config saved successfully');
        setSavedMachines(updatedMachines);
      } catch (error) {
        console.error('Error saving machine config to user:', error);
      }
    }
  };

  const handleFillMachineData = machine => {
    if (machine.Treadmill) {
      setTreadmillName(machine.Treadmill.name);
      setInclination(machine.Treadmill.inclination.toString());
      setMaxSpeed(machine.Treadmill.maxSpeed.toString());
      setIsDefault(machine.Treadmill.isDefault);
    } else if (machine.Bicycle) {
      setBicycleName(machine.Bicycle.name);
      setMaxSpeed(machine.Bicycle.maxResistance.toString());
      setIsDefault(machine.Bicycle.isDefault);
    }
  };

  const filteredMachines = savedMachines.filter(machine => {
    if (type === 'Cycling') {
      return machine.Bicycle;
    } else {
      return machine.Treadmill;
    }
  });

  const handleResetInputs = () => {
    setBicycleName('');
    setTreadmillName('');
    setInclination('');
    setMaxSpeed('');
    setNameError('');
    setInclinationError('');
    setMaxSpeedError('');
    setIsDefault(false);
  };

  const handleDeleteMachine = async machine => {
    setMachineToDelete(machine);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDeleteMachine = async () => {
    if (currentUser && currentUser.userId) {
      try {
        const userDocRef = doc(db, 'users', currentUser.userId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        let updatedMachines = [];
        if (userData && userData.machines && Array.isArray(userData.machines)) {
          updatedMachines = [...userData.machines];
        }

        const index = updatedMachines.findIndex(m => {
          if (machineToDelete.Treadmill) {
            return m.Treadmill && m.Treadmill.name === machineToDelete.Treadmill.name;
          } else if (machineToDelete.Bicycle) {
            return m.Bicycle && m.Bicycle.name === machineToDelete.Bicycle.name;
          }
        });

        if (index > -1) {
          updatedMachines.splice(index, 1);
        }

        await updateDoc(userDocRef, {
          machines: updatedMachines,
        });

        console.log('Machine config deleted successfully');

        setSavedMachines(updatedMachines);
      } catch (error) {
        console.error('Error deleting machine config from user:', error);
      }
    }
    setShowDeleteConfirmation(false);
    setMachineToDelete(null);
  };

  return (
    <Modal onRequestClose={onClose} animationType="slide" presentationStyle="formSheet" visible={isVisible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContent}>
          <View style={styles.modalCloseButtonContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>
            {type === 'Cycling' ? 'Configure a sua bicicleta' : 'Configure a sua Passadeira'}
          </Text>
          {type === 'Cycling' ? (
            <>
              <TextInput
                label="Bicicleta"
                onChangeText={setBicycleName}
                value={initialBicycleName}
                mode="outlined"
                placeholder="Nome ou modelo da sua bicicleta"
                style={styles.modalInput}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <TextInput
                label="Ajuste de resistência"
                placeholder="Adicione o seu nível máximo dificuldade"
                value={initialMaxSpeed}
                onChangeText={setMaxSpeed}
                keyboardType="numeric"
                mode="outlined"
                style={styles.modalInput}
              />
              {maxSpeedError ? <Text style={styles.errorText}>{maxSpeedError}</Text> : null}
            </>
          ) : (
            <>
              <TextInput
                label="Passadeira"
                onChangeText={setTreadmillName}
                value={initialTreadmillName}
                mode="outlined"
                placeholder="Nome ou modelo da sua passadeira"
                style={styles.modalInput}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <TextInput
                label="Inclinação máxima"
                placeholder="Inclinação máxima suportada"
                value={initialInclination}
                onChangeText={setInclination}
                keyboardType="numeric"
                mode="outlined"
                style={styles.modalInput}
              />
              {inclinationError ? <Text style={styles.errorText}>{inclinationError}</Text> : null}
              <TextInput
                label="Velocidade máxima"
                placeholder="Velocidade máxima atingível"
                value={initialMaxSpeed}
                onChangeText={setMaxSpeed}
                keyboardType="numeric"
                mode="outlined"
                style={styles.modalInput}
              />
              {maxSpeedError ? <Text style={styles.errorText}>{maxSpeedError}</Text> : null}
            </>
          )}
          <View style={styles.modalSwitchContainer}>
            <Text style={styles.modalSwitchText}>Default</Text>
            <Switch value={isDefault} onValueChange={value => setIsDefault(value)} />
          </View>
          <TouchableOpacity onPress={handleResetInputs}>
            <MaterialCommunityIcons
              name="restart"
              size={24}
              color="black"
              style={styles.modalIcon}
              activeOpacity={0.8}
            />
            <Text style={styles.modalIconText}>Reiniciar</Text>
          </TouchableOpacity>

          <Button onPress={handleStart} label="Iniciar" style={styles.modalButton} activeOpacity={0.8} />
          <Button onPress={handleSaveMachineData} label="Guardar" style={styles.modalButtonG} activeOpacity={0.8} />

          <View>
            <Text style={styles.machineDataTitle}>Minhas Máquinas</Text>
            {filteredMachines.map((machine, index) => (
              <View key={index} style={styles.machineItemContainer}>
                {machine.Treadmill && (
                  <>
                    <List.Item
                      onPress={() => handleFillMachineData(machine)}
                      title={`Passadeira : ${machine.Treadmill.name}`}
                    />
                  </>
                )}
                {machine.Bicycle && (
                  <>
                    <List.Item
                      onPress={() => handleFillMachineData(machine)}
                      title={`Bicicleta : ${machine.Bicycle.name}`}
                    />
                  </>
                )}
                <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteMachine(machine)}>
                  <List.Icon icon="delete" color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <Modal
            visible={showDeleteConfirmation}
            animationType="slide"
            onRequestClose={() => setShowDeleteConfirmation(false)}
            transparent
          >
            <View style={styles.confirmationModalContainer}>
              <View style={styles.confirmationModal}>
                <Text style={styles.confirmationText}>Tem certeza que deseja excluir esta máquina?</Text>
                <View style={styles.confirmationButtonsContainer}>
                  <Button
                    onPress={() => setShowDeleteConfirmation(false)}
                    label="Cancelar"
                    style={[styles.modalButton, { marginRight: 10 }]}
                  />
                  <Button onPress={handleConfirmDeleteMachine} label="Confirmar" style={styles.modalButton} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = {
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalCloseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  modalCloseButton: {
    width: 80,
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
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  modalButtonG: {
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  machineDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  machineItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
  },
  deleteIcon: {
    padding: 10,
  },
  confirmationModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '100%',
  },
  confirmationModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalIcon: {
    padding: 10,
    marginLeft: '45%',
    bottom: 20,
  },
  modalIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: '45%',
    bottom: 30,
  },
  modalSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalSwitchText: {
    fontSize: 16,
    color: 'gray',
  },
};

export default ConfigurationModal;
