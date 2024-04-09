// Style
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    body: {
        flex: 1,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
    },
    uploadButtonContainer: {
        backgroundColor: '#581DB9',
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    list: {
        padding: 10,
    },
    dialogContainer: {
        backgroundColor: '#fff',

    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#581DB9',
        padding: 10,
        alignSelf: 'center',
    },
    input: {
        backgroundColor: '#fff',
        marginTop: 10,
    },
    error: {
        color: 'red',
        marginTop: 5,
        marginLeft: 5,
    },
});
