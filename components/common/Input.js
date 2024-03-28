import { StyleSheet, View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'

const Input = ({ errorText, ...props }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                selectionColor={props.color}
                underlineColor={props.underline}
                mode={props.mode}
                theme={{
                    roundness: 5,
                    colors: {
                        primary: "#581DB9",
                        underlineColor: 'transparent'
                    }
                }}
                {...props}
            />
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        width: '100%',
        height: 50,
        margin: 'auto',
        borderRadius: "50px",
        backgroundColor: '#fff',
        marginVertical: 10,marginVertical: 10,
        
    },
    error: {
        fontSize: 14,
        color: 'red'
    }
})


export { Input }
