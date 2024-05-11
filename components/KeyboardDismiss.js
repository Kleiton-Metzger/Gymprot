import { Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

const DismissKeyboard = ({ children }) => (
  <SafeAreaView>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  </SafeAreaView>
);

export { DismissKeyboard };
