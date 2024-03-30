import { StyleSheet, Text } from 'react-native'

const Header = ({ children }) => (
    <Text style={styles.container}>{children}</Text>
)

const styles = StyleSheet.create({
    container: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold',
        paddingVertical: 15,
        textAlign: 'center'
    }
})

export { Header }