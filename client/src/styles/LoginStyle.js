import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    color: Colors.link,
    marginBottom: 20,
    marginTop: 5,
    fontSize: 14,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray,
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    width: '80%',
    height: '50',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  registerLinkContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  registerText: {
    fontSize: 15,
    color: '#555',
  },
  registerLink: {
    fontSize: 15,
    color: Colors.link,
    fontWeight: 'bold',
  },
  footerLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 9,
    color: '#888',
    marginHorizontal: 5,
  },
  developedByContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  developedByText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
});
