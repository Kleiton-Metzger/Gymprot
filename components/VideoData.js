import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../screens/Videos/VideoRepro/styles';

const VideoData = ({ dataPoints, currentDataPointIndex, type, treadmillName, bicycleName, inclination, maxSpeed }) => {
  const calculateAltitudeChange = useCallback(() => {
    if (currentDataPointIndex > 0) {
      const currentElevation = parseFloat(dataPoints[currentDataPointIndex].initialElevation);
      const previousElevation = parseFloat(dataPoints[currentDataPointIndex - 1].elevation);
      const elevationGain = currentElevation - previousElevation;

      let altitudeChangeStatus = '';
      if (elevationGain > 0) {
        altitudeChangeStatus = 'A subir';
      } else if (elevationGain < 0) {
        altitudeChangeStatus = 'A descer';
      } else {
        altitudeChangeStatus = 'Sem mudança';
      }

      return `${elevationGain.toFixed(2)}m (${altitudeChangeStatus})`;
    }
    return 'N/A';
  }, [currentDataPointIndex, dataPoints]);

  if (!dataPoints || dataPoints.length === 0) return null;

  const currentDataPoint = dataPoints[currentDataPointIndex] || {};

  return (
    <View style={styles.sensorContainer}>
      {[
        { label: 'Tempo:', value: `${currentDataPoint.Tempo || 'N/A'}` },
        { label: 'Current Speed:', value: `${currentDataPoint.speed || 'N/A'} m/s` },
        { label: 'Altitude:', value: `${currentDataPoint.elevation || 'N/A'} m` },
        { label: 'Altitude Gain:', value: calculateAltitudeChange() },
      ].map((item, index) => (
        <View style={styles.sensorItem} key={index}>
          <Text style={styles.sensorLabel}>{item.label}</Text>
          <Text style={styles.sensorData}>{item.value}</Text>
        </View>
      ))}

      {type === 'Running' && (
        <View style={styles.machineDataContainer}>
          <Text style={styles.machineDataTitle}>Tipo de Exercício:</Text>
          <Text style={styles.machineDataname}>Corrida</Text>

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
          <Text style={styles.machineDataname}>Ciclismo</Text>

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
          <Text style={styles.machineDataname}>Caminhada</Text>

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
