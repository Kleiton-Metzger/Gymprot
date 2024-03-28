import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const Button = ({ label, ...props }) => {
  return (
    <TouchableOpacity style={styles.container} {...props} >
        <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        backgroundColor: '#581DB9',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
})

export { Button }