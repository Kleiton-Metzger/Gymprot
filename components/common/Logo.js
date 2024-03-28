import { StyleSheet, Image } from 'react-native';


const Logo = () => <Image source={require('../../assets/logo.png')} style={styles.container} />


const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 50,
        borderWidth: 1,
        borderColor: 'black',
    }
})

export { Logo }