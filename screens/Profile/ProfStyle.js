import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  notifyIcon: {
    marginLeft: 10,
  },
  defyIcon: {
    marginRight: 10,
  },
  userDataContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#581DB9',
    marginRight: 15,
  },
  userDatas: {
    flex: 1,
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
  followItem: {
    marginRight: 20,
  },
  followText: {
    color: 'darkgray',
    fontWeight: 'bold',
  },
  followNumber: {
    color: 'black',
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    marginVertical: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.28,
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
  },
  tallerStatBox: {
    height: 150,
  },
  stat: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  statIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    height: 40,
    width: 40,
  },
  progressText: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 10,
  },
  achievementsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    marginBottom: 10,
  },
  chartContainer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    width: '100%',
    height: '100%',
  },
  recordContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingBottom: 20,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    marginBottom: 10,
  },
  recordContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  filterIcon: {
    width: width * 0.25,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  filterImage: {
    width: 30,
    height: 30,
  },
  recordData: {
    flexDirection: 'column',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  recordText: {
    fontSize: 12,
    color: 'black',
    marginLeft: 10,
    flex: 1,
  },
  recordNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
});
