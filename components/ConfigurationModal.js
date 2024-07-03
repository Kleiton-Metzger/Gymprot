import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { TextInput } from 'react-native-paper';
import { styles } from '../screens/Videos/VideoRepro/styles';

const ConfigurationModal = ({
  isVisible,
  onClose,
  bicycleName,
  setBicycleName,
  treadmillName,
  setTreadmillName,
  inclination,
  setInclination,
  maxSpeed,
  setMaxSpeed,
  onStart,
  type,
}) => {
  const [nameError, setNameError] = useState('');
  const [inclinationError, setInclinationError] = useState('');
  const [maxSpeedError, setMaxSpeedError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (type === 'Cycling' && !bicycleName) {
      setNameError('O nome ou modelo da bicicleta é obrigatório');
      isValid = false;
    } else if (type !== 'Cycling' && !treadmillName) {
      setNameError('Indique marca ou modelo da passadeira');
      isValid = false;
    } else {
      setNameError('');
    }

    if (type !== 'Cycling' && (!inclination || isNaN(inclination))) {
      setInclinationError('Indique a inclinação máxima da passadeira');
      isValid = false;
    } else {
      setInclinationError('');
    }

    if (!maxSpeed || isNaN(maxSpeed)) {
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
                value={bicycleName}
                mode="outlined"
                placeholder="Nome ou modelo da sua bicicleta"
                style={styles.modalInput}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <TextInput
                label="Ajuste de resistência"
                placeholder="Adicione o seu nível máximo dificuldade"
                value={maxSpeed}
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
                value={treadmillName}
                mode="outlined"
                placeholder="Nome ou modelo da sua passadeira"
                style={styles.modalInput}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <TextInput
                label="Inclinação máxima"
                placeholder="Inclinação máxima suportada"
                value={inclination}
                onChangeText={setInclination}
                keyboardType="numeric"
                mode="outlined"
                style={styles.modalInput}
              />
              {inclinationError ? <Text style={styles.errorText}>{inclinationError}</Text> : null}
              <TextInput
                label="Velocidade máxima"
                placeholder="Velocidade máxima atingível"
                value={maxSpeed}
                onChangeText={setMaxSpeed}
                keyboardType="numeric"
                mode="outlined"
                style={styles.modalInput}
              />
              {maxSpeedError ? <Text style={styles.errorText}>{maxSpeedError}</Text> : null}
            </>
          )}
          <Button onPress={handleStart} label="Iniciar" style={styles.modalButton} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfigurationModal;
