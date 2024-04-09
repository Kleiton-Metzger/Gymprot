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
    dialogTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#581DB9',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
});
