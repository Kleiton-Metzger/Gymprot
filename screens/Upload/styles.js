import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(154, 151, 151, 1)',
        width: 350,
        height: '50%',
        position: 'absolute',
        top: '30%',
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        position: 'absolute',
        padding: '20%',
        top: 30,
    },
    subtext: {
        fontSize: 15,
        position: 'absolute',
        padding: '15%',
        top: 100,
    },
    buttonContainer: {
        backgroundColor: 'rgba(88, 29, 185, 1)',
        padding: 15,
        width: 250,
        alignItems: 'center',
        borderRadius: 25,
        top: 20,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    usrname: {
        position: 'absolute',
        padding: '5%',
        top: 80,
    },
});

export default styles;