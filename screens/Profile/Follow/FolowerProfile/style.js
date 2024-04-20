import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  bckButton: {
    width: '15%',
    height: 40,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    width: '68%',
    textAlign: 'center',
  },
  profileContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#581DB9',
    borderWidth: 3,
    marginBottom: 10,
  },

  userFollow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  seguidoresContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  segdrTxt: {
    color: 'darkgray',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  segdrNum: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  buttonContainer: {
    height: 40,
    width: 10,
    marginLeft: '5%',
    right: 100,
  },
  bioContainer: {
    padding: 10,
    width: '100%',
    height: 'auto',
  },
  bioText: {
    fontSize: 14,
    color: '#818589',
    textAlign: 'justify',
    alignSelf: 'center',
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
  },
  userNameU: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#581DB9',
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  avatarUser: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'darkgray',
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    left: 5,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  tipo: {
    fontSize: 14,
    color: 'gray',
  },
  video: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  videoGridContainer: {
    paddingBottom: 80,
  },
  videoItem: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export { styles };
