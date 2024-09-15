import React, { useCallback } from 'react';
import { View, Text } from 'react-native';

const VideoData = ({
  dataPoints,
  currentDataPointIndex,
  type,
  treadmillName,
  bicycleName,
  inclination,
  maxSpeed,
  distance,
}) => {
  const calculateAltitudeChange = useCallback(() => {
    if (currentDataPointIndex > 0) {
      const currentElevation = parseFloat(dataPoints[currentDataPointIndex].elevation);
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

  const calculateInclination = useCallback(() => {
    if (currentDataPointIndex > 0) {
      const currentElevation = parseFloat(dataPoints[currentDataPointIndex].elevation);
      const previousElevation = parseFloat(dataPoints[currentDataPointIndex - 1].elevation);
      const elevationGain = currentElevation - previousElevation;

      const currentDistance = parseFloat(dataPoints[currentDataPointIndex].distance) || 0; // Distância em metros, km, etc.

      if (currentDistance > 0) {
        // Calcula a inclinação da rua como percentagem
        const outdoorInclinePercentage = ((elevationGain / currentDistance) * 100).toFixed(2);

        // Ajusta para inclinação equivalente na passadeira (assumindo 1% adicional de resistência)
        const treadmillEquivalentIncline = (parseFloat(outdoorInclinePercentage) + 1).toFixed(2);

        return `${treadmillEquivalentIncline}%`;
      }
    }
    return 'N/A';
  }, [currentDataPointIndex, dataPoints]);
  const calculateBikeResistanceLevel = useCallback(() => {
    if (currentDataPointIndex > 0 && dataPoints[currentDataPointIndex] && dataPoints[currentDataPointIndex - 1]) {
      const currentElevation = parseFloat(dataPoints[currentDataPointIndex].elevation);
      const previousElevation = parseFloat(dataPoints[currentDataPointIndex - 1].elevation);
      const elevationGain = currentElevation - previousElevation; // Ganho de elevação

      const currentDistance = parseFloat(dataPoints[currentDataPointIndex].distance) || 0; // Distância percorrida

      // Simplificação: resistência baseando-se na inclinação e num fator arbitrário para simular subida
      if (currentDistance > 0) {
        const inclinePercentage = ((elevationGain / currentDistance) * 100).toFixed(2);

        // Assumindo uma escala de 1 a 10 para resistência
        const resistanceLevel = Math.min(Math.ceil(inclinePercentage / 10), 10); // Divisão simples para manter o nível entre 1-10

        return `Nível ${resistanceLevel}`;
      }
    }
    return 'N/A';
  }, [currentDataPointIndex, dataPoints]);

  if (!dataPoints || dataPoints.length === 0) return null;

  const currentDataPoint = dataPoints[currentDataPointIndex] || {};

  return (
    <View style={styles.sensorContainer}>
      {[
        { label: 'Tempo do vídeo:', value: `${currentDataPoint.videoTime || 'N/A'}` },
        { label: 'Velocidade:', value: `${currentDataPoint.speed.toFixed(2) || 'N/A'} m/s` },
        { label: 'Altitude:', value: `${currentDataPoint.elevation.toFixed(2) || 'N/A'} m` },
        { label: 'Altitude Gain:', value: calculateAltitudeChange() },
        { label: 'Inclinação:', value: calculateInclination() },
        { label: 'Nível de Resistência da Bicicleta:', value: calculateBikeResistanceLevel() },
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
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  sensorContainer: {
    padding: 10,
    borderRadius: 10,
  },
  sensorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sensorLabel: {
    color: 'white',
    fontSize: 15,
  },
  sensorData: {
    color: 'white',
    fontSize: 15,
  },
  machineDataContainer: {
    marginTop: 10,
  },
  machineDataTitle: {
    color: 'white',
    fontSize: 15,
  },
  machineDataname: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  machineDataItem: {
    marginTop: 5,
  },
  machineDataLabel: {
    color: 'white',
    fontSize: 15,
  },
  machineDataValue: {
    color: 'white',
    fontSize: 15,
  },
};

export default VideoData;
