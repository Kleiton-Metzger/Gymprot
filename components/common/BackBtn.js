import { TouchableOpacity, StyleSheet, Text,Image } from 'react-native';

const BackBtn = ({ label, ...props }) => {
  return (
    <TouchableOpacity style={styles.container} {...props} >
        <Image source={require('../../assets/back.png')} style={styles.backBtn} />
        <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',},
    backBtn: {
        width: 40,
        height: 40,
        marginRight: 5,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    });

export  { BackBtn}
