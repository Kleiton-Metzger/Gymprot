import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../screens/Videos/VideoRepro/styles';

const VideoData = ({ dataPoints, currentDataPointIndex, type, treadmillName, bicycleName, inclination, maxSpeed }) => {
  const calculateAltitudeChange = useCallback(() => {
    const elevationGain =
      currentDataPointIndex > 0
        ? dataPoints[currentDataPointIndex].elevation - dataPoints[currentDataPointIndex - 1].elevation
        : 0;

    let altitudeChangeStatus = '';
    if (elevationGain > 0) {
      altitudeChangeStatus = 'A subir';
    } else if (elevationGain < 0) {
      altitudeChangeStatus = 'A descer';
    } else {
      altitudeChangeStatus = 'Sem mudança';
    }

    return `${elevationGain.toFixed(2)}m (${altitudeChangeStatus})`;
  }, [currentDataPointIndex, dataPoints]);

  if (dataPoints.length === 0) return null;

  return (
    <View style={styles.sensorContainer}>
      {[
        { label: 'Tempo:', value: `${dataPoints[currentDataPointIndex]?.Tempo || 'N/A'} s` },
        { label: 'Current Speed:', value: `${dataPoints[currentDataPointIndex]?.speed || 'N/A'} m/s` },
        { label: 'Altitude:', value: `${dataPoints[currentDataPointIndex]?.elevation || 'N/A'} m` },
        { label: 'Altitude Gain:', value: currentDataPointIndex > 0 ? calculateAltitudeChange() : 'N/A' },
      ].map((item, index) => (
        <View style={styles.sensorItem} key={index}>
          <Text style={styles.sensorLabel}>{item.label}</Text>
          <Text style={styles.sensorData}>{item.value}</Text>
        </View>
      ))}

      {type === 'Running' && (
        <View style={styles.machineDataContainer}>
          <Text style={styles.machineDataTitle}>Tipo de Exercício:</Text>
          <Text style={styles.machineDataname}>{type === 'Running' ? 'Corrida' : type}</Text>

          <View style={styles.machineDataItem}>
            <Text style={styles.machineDataLabel}>Marca/Modelo:</Text>
            <Text style={styles.machineDataValue}>{treadmillName}</Text>

            <Text style={styles.machineDataLabel}>Inclinação Máxima:</Text>
            <Text style={styles.machineDataValue}>{inclination} %</Text>

            <Text style={styles.machineDataLabel}>Velocidade Máxima:</Text>
            <Text style={styles.machineDataValue}>{maxSpeed} m/s</Text>
          </View>
        </View>
      )}

      {type === 'Cycling' && (
        <View style={styles.machineDataContainer}>
          <Text style={styles.machineDataTitle}>Tipo de Exercício:</Text>
          <Text style={styles.machineDataname}>{type === 'Cycling' ? 'Ciclismo' : type}</Text>

          <View style={styles.machineDataItem}>
            <Text style={styles.machineDataLabel}>Marca/Modelo da Bicicleta:</Text>
            <Text style={styles.machineDataValue}>{bicycleName}</Text>

            <Text style={styles.machineDataLabel}>Nível Máximo de Resistência:</Text>
            <Text style={styles.machineDataValue}>{maxSpeed}</Text>
          </View>
        </View>
      )}

      {type === 'Walking' && (
        <View style={styles.machineDataContainer}>
          <Text style={styles.machineDataTitle}>Tipo de Exercício:</Text>
          <Text style={styles.machineDataname}>{type === 'Walking' ? 'Caminhada' : type}</Text>

          <View style={styles.machineDataItem}>
            <Text style={styles.machineDataLabel}>Marca/Modelo:</Text>
            <Text style={styles.machineDataValue}>{treadmillName}</Text>

            <Text style={styles.machineDataLabel}>Inclinação Máxima:</Text>
            <Text style={styles.machineDataValue}>{inclination} %</Text>

            <Text style={styles.machineDataLabel}>Velocidade Máxima:</Text>
            <Text style={styles.machineDataValue}>{maxSpeed} m/s</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoData;
