import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import Colors from '../../constants/colors';

export default function CustomModalFilter({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  data,
  renderModal,
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" style={{ marginBottom: 10 }} />
            </TouchableOpacity>

            {/* Thanh tìm kiếm trong Modal */}
            <View style={styles.modalHeader}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput
                style={styles.modalInput}
                placeholder="Tìm từ khoá..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Danh sách các thành phố */}
          <FlatList
            data={data}
            renderItem={renderModal}
            keyExtractor={item => item.id || item.code}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy modal lên từ dưới lên
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 0,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    paddingLeft: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  modalInput: {
    marginLeft: 8,
    flex: 1,
    color: Colors.black,
  },
});
