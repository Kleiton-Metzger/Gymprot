import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { TextInput, List } from 'react-native-paper';
import { styles } from '../screens/Videos/VideoRepro/styles';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../storage/Firebase';
import { useAuth } from '../Hooks/useAuth';

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

        updatedMachines.push({
          [newMachineConfig.type]: {
            name: newMachineConfig.name,
            ...(newMachineConfig.type === 'Treadmill' && { inclination: newMachineConfig.inclination }),
            ...(newMachineConfig.type === 'Treadmill' && { maxSpeed: newMachineConfig.maxSpeed }),
            ...(newMachineConfig.type === 'Bicycle' && { maxResistance: newMachineConfig.maxResistance }),
          },
        });

        await updateDoc(userDocRef, {
          machines: updatedMachines,
        });

        console.log('Machine config added successfully');

        setSavedMachines(updatedMachines);
      } catch (error) {
        console.error('Error adding machine config to user:', error);
      }
    }
  };

  const handleFillMachineData = machine => {
    if (machine.Treadmill) {
      setTreadmillName(machine.Treadmill.name);
      setInclination(machine.Treadmill.inclination.toString());
      setMaxSpeed(machine.Treadmill.maxSpeed.toString());
    } else if (machine.Bicycle) {
      setBicycleName(machine.Bicycle.name);
      setMaxSpeed(machine.Bicycle.maxResistance.toString());
    }
  };

  const filteredMachines = savedMachines.filter(machine => {
    if (type === 'Cycling') {
      return machine.Bicycle;
    } else {
      return machine.Treadmill;
    }
  });

  const handleDeleteMachine = async machine => {
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
          if (machine.Treadmill) {
            return m.Treadmill && m.Treadmill.name === machine.Treadmill.name;
          } else if (machine.Bicycle) {
            return m.Bicycle && m.Bicycle.name === machine.Bicycle.name;
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
  };

  return (
    <Modal onRequestClose={onClose} animationType="slide" presentationStyle="formSheet" visible={isVisible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
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
          <Button onPress={handleStart} label="Iniciar" style={styles.modalButton} />
          <Button onPress={handleSaveMachineData} label="Guardar" style={styles.modalButtonG} />

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                alignSelf: 'center',
                fontWeight: 'bold',
                marginBottom: 20,
              }}
            >
              Minhas Máquinas
            </Text>
            {filteredMachines.map((machine, index) => (
              <View key={index} style={styles.machineItemContainer}>
                <List.Accordion
                  onLongPress={() => {
                    handleDeleteMachine(machine);
                  }}
                  title={machine.Treadmill ? `Passadeiras:` : `Bicicletas: `}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon={machine.Treadmill ? 'run-fast' : 'bike'}
                      color={machine.Treadmill ? '#581DB9' : '#581DB9'}
                    />
                  )}
                  theme={{ colors: { primary: '#581DB9' } }}
                  style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fff' }}
                >
                  {machine.Treadmill && (
                    <>
                      <List.Item
                        style={{ padding: 10 }}
                        onPress={() => {
                          handleFillMachineData(machine);
                        }}
                        title={`Nome: ${machine.Treadmill.name}`}
                      />
                      <List.Item title={`Inclinação máxima: ${machine.Treadmill.inclination}`} />
                      <List.Item style={styles.sensorItem} title={`Velocidade máxima: ${machine.Treadmill.maxSpeed}`} />
                    </>
                  )}
                  {machine.Bicycle && (
                    <>
                      <List.Item
                        onPress={() => {
                          handleFillMachineData(machine);
                        }}
                        title={`Nome: ${machine.Bicycle.name}`}
                      />
                      <List.Item title={`Resistência máxima: ${machine.Bicycle.maxResistance}`} />
                    </>
                  )}
                </List.Accordion>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => {
                    handleDeleteMachine(machine);
                  }}
                >
                  <List.Icon icon="delete" color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfigurationModal;
