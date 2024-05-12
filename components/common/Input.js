import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

const Input = props => {
  const { errorText, width, color, underline, mode, textContentType, ...rest } = props;
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={{ width: width ? width : '100%' }}>
      <View style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextInput
          selectionColor={color}
          underlineColor={underline}
          mode={mode}
          style={styles.input}
          secureTextEntry={textContentType === 'password' ? secureTextEntry : false}
          theme={{
            roundness: 5,
            colors: {
              primary: '#581DB9',
              underlineColor: 'transparent',
            },
          }}
          {...rest}
        />
        {textContentType === 'password' ? (
          <FontAwesome5
            name={secureTextEntry ? 'eye-slash' : 'eye'}
            color="black"
            size={15}
            style={styles.icon}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        ) : null}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  icon: {
    position: 'absolute',
    right: 1,
    top: '22%',
    padding: 20,
  },
  error: {
    fontSize: 14,
    color: 'red',
  },
});

export { Input };
