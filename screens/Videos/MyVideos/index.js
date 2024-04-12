import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { PrivateScreen } from '../PrivateVideos';
import { PublicScreen } from '../PublicVideos';
import styles from './styles';

export const MyVideos = () => {
  const [value, setValue] = React.useState('public');

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        style={styles.segmentedButtons}
        value={value}
        onValueChange={setValue}
        buttons={[
          { value: 'public', label: 'Public', icon: 'earth', checkedColor: '#581DB9', uncheckedColor: 'gray' },
          { value: 'private', label: 'Private', icon: 'lock', checkedColor: '#581DB9', uncheckedColor: 'gray' },
        ]}
      />
      <View>{value === 'public' ? <PublicScreen /> : <PrivateScreen />}</View>
    </SafeAreaView>
  );
};
