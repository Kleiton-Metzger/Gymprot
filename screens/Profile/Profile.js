import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useAuth } from '../../Hooks/useAuth';
import { ProgressCircle } from 'react-native-svg-charts';
import { styles } from './ProfStyle';

const ProgressWithLabel = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <ProgressCircle style={styles.progressCircle} progress={progress} progressColor={'#581DB9'} />
      <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
};

// Função para calcular a distância usando a fórmula de Haversine
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance;
};

export const Profile = () => {
  const navigation = useNavigation();
  const { currentUser, videos } = useAuth();
  const [activeFilter, setActiveFilter] = useState(null);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60, 70],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(88, 29, 185, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.4,
    useShadowColorFromDataset: false,
    fillShadowGradient: '#581DB9',
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
  };

  const calculateMetrics = filter => {
    if (!videos || !Array.isArray(videos)) return;

    let filteredVideos = videos.filter(video => video.type === filter);

    if (filteredVideos.length === 0) {
      setMaxSpeed(0);
      setTotalDistance(0);
      setTotalTime(0);
      return;
    }

    // Use Math.max with default value to handle cases with no data points
    let maxSpeedCalc = Math.max(...filteredVideos.flatMap(video => video.dataPoints.map(dp => dp.speed))) || 0;

    let totalDistanceCalc = filteredVideos.reduce((total, video) => {
      const dataPoints = video.dataPoints || [];
      if (dataPoints.length < 2) return total;

      const firstPoint = dataPoints[0];
      const lastPoint = dataPoints[dataPoints.length - 1];

      const distance = calculateHaversineDistance(
        firstPoint.latitude,
        firstPoint.longitude,
        lastPoint.latitude,
        lastPoint.longitude,
      );

      return total + distance;
    }, 0);

    let totalTimeCalc = filteredVideos.reduce(
      (total, video) => total + (video.dataPoints || []).reduce((time, dp) => time + (dp.videoTime || 0), 0),
      0,
    );

    setMaxSpeed(maxSpeedCalc);
    setTotalDistance(totalDistanceCalc);
    setTotalTime(totalTimeCalc);
  };

  useEffect(() => {
    if (activeFilter) {
      calculateMetrics(activeFilter);
    }
  }, [activeFilter, videos]);

  const handleFilterPress = filterName => {
    setActiveFilter(prevFilter => (prevFilter === filterName ? null : filterName));
    calculateMetrics(filterName);
  };

  useEffect(() => {
    if (activeFilter) {
      calculateMetrics(activeFilter);
    }
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('NotificationScreen')}>
          <Octicons name="bell" size={24} color="#581DB9" style={styles.notifyIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ConfigurationsScreen')} activeOpacity={0.7}>
          <MaterialCommunityIcons name="cog-outline" size={27} color="#581DB9" style={styles.defyIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.userDataContainer}>
        <Image
          style={styles.avatar}
          source={currentUser.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
        />
        <View style={styles.userDatas}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <View style={styles.userFollow}>
            <TouchableOpacity
              style={styles.followItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('FollowListScreen')}
            >
              <Text style={styles.followText}>Seguidores</Text>
              <Text style={styles.followNumber}>{currentUser.seguidores ? currentUser.seguidores.length : 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.followItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('FollowListScreen')}
            >
              <Text style={styles.followText}>Seguindo</Text>
              <Text style={styles.followNumber}>{currentUser.seguindo ? currentUser.seguindo.length : 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Minhas Atividades</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContent}>
            <View style={[styles.statBox, { backgroundColor: '#F8E4D9' }]}>
              <Text style={{ ...styles.stat, fontWeight: 'bold' }}>Caminhada</Text>
              <Image source={require('../../assets/walk.png')} style={styles.statIcon} />
              <ProgressWithLabel progress={0.07} />
              <Text style={styles.stat}>Dia 0</Text>
              <Text style={styles.stat}>0 Min</Text>
              <Text style={styles.stat}>0 Calorias</Text>
            </View>
            <View style={[styles.statBox, styles.tallerStatBox, { backgroundColor: '#d7f0f7' }]}>
              <Text style={{ ...styles.stat, fontWeight: 'bold' }}>Corrida</Text>
              <Image source={require('../../assets/run.png')} style={styles.statIcon} />
              <ProgressWithLabel progress={0.7} />
              <Text style={styles.stat}>Dia 0</Text>
              <Text style={styles.stat}>0 Min</Text>
              <Text style={styles.stat}>0 Calorias</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#dad5fe' }]}>
              <Text style={{ ...styles.stat, fontWeight: 'bold' }}>Ciclismo</Text>
              <Image source={require('../../assets/cycle.png')} style={styles.statIcon} />
              <ProgressWithLabel progress={1} />
              <Text style={styles.stat}>Dia 0</Text>
              <Text style={styles.stat}>0 Min</Text>
              <Text style={styles.stat}>0 Calorias</Text>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Histórico de Atividades</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={data}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix=" Min"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                style={styles.chart}
                yAxisInterval={1}
              />
            </View>
          </View>

          <View style={styles.recordContainer}>
            <Text style={styles.recordTitle}>Gravações</Text>
            <View style={styles.recordContent}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.filterIcon, { backgroundColor: activeFilter === 'Walking' ? '#581DB9' : 'lightgray' }]}
                onPress={() => handleFilterPress('Walking')}
              >
                <Image source={require('../../assets/walk.png')} style={styles.filterImage} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.filterIcon, { backgroundColor: activeFilter === 'Running' ? '#581DB9' : 'lightgray' }]}
                onPress={() => handleFilterPress('Running')}
              >
                <Image source={require('../../assets/run.png')} style={styles.filterImage} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.filterIcon, { backgroundColor: activeFilter === 'Cycling' ? '#581DB9' : 'lightgray' }]}
                onPress={() => handleFilterPress('Cycling')}
              >
                <Image source={require('../../assets/cycle.png')} style={styles.filterImage} />
              </TouchableOpacity>
            </View>

            {/* Dados de Gravação */}
            <View style={styles.recordData}>
              <View style={styles.recordItem}>
                <MaterialCommunityIcons name="gauge-full" size={24} color="gray" />
                <Text style={styles.recordText}>Max.Velocidade</Text>
                <Text style={styles.recordNumber}>{maxSpeed.toFixed(2)} km/h</Text>
              </View>
              <View style={styles.recordItem}>
                <MaterialCommunityIcons name="map-marker-distance" size={24} color="gray" />
                <Text style={styles.recordText}>Distância</Text>
                <Text style={styles.recordNumber}>{totalDistance.toFixed(2)} km</Text>
              </View>
              <View style={styles.recordItem}>
                <MaterialCommunityIcons name="clock" size={24} color="gray" />
                <Text style={styles.recordText}>Tempo</Text>
                <Text style={styles.recordNumber}>{totalTime} min</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
