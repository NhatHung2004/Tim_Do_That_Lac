import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';

export default function AuthHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>LOST AND FOUND</Text>

      <View style={styles.rightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 35,
    paddingBottom: 10,
    backgroundColor: Colors.secondary,
    borderBottomWidth: 0,
    borderBottomColor: Colors.gray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -15,
    padding: 10,
    marginLeft: 5,
  },
  rightPlaceholder: {
    width: 24 + 10,
    height: 24,
  },
});
