import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ManagedPostItem({ title, location, description, posted_time }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardLocation}>{location}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={styles.cardDate}>{posted_time}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="delete" size={24} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="edit" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
});
