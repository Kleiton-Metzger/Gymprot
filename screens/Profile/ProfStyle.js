import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  notifyIcon: {
    left: 10,
  },
  defyIcon: {
    right: 10,
  },
  userDataContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#581DB9',
    marginRight: 10,
  },
  userDatas: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  userFollow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  seguidoresContainer: {
    marginRight: 20,
  },
  segdrTxt: {
    color: 'darkgray',
    fontWeight: 'bold',
  },
  segdrNum: {
    color: 'black',
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    marginTop: 10,
    marginBottom: 10,
  },
  statsContent: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    fontSize: 16,
    color: 'black',
  },
  achievementsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
  },
});
