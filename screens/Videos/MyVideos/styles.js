import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    opcbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(154, 151, 151, 1)',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        top: "20%",
        borderRadius: 25,
        height: 50,
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
  
});

export default styles;  