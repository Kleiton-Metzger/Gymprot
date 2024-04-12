import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const Input = ({ errorText, width, ...props }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={{ width: width ? width : '100%' }}>
      <TextInput
        selectionColor={props.color}
        underlineColor={props.underline}
        mode={props.mode}
        style={styles.input}
        secureTextEntry={props.textContentType === 'password' ? secureTextEntry : false}
        right={
          props.textContentType === 'password' ? (
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
              forceTextInputFocus={false}
            />
          ) : null
        }
        theme={{
          roundness: 5,
          colors: {
            primary: '#581DB9',
            underlineColor: 'transparent',
          },
        }}
        {...props}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    margin: 'auto',
    borderRadius: '50px',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginVertical: 10,
  },
  error: {
    fontSize: 14,
    color: 'red',
  },
});

export { Input };
