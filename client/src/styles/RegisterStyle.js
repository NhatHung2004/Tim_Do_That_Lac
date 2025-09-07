import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  passwordRequirements: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  requirementTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
    color: '#E04F5F',
    marginBottom: 3,
  },
  validRequirement: {
    color: '#0a0',
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
    width: '80%', // Khoảng cách giữa các nút
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: '80%',
    height: 30,
    resizeMode: 'contain',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 15,
    color: '#555',
  },
  loginLink: {
    fontSize: 15,
    color: Colors.link,
    fontWeight: 'bold',
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
