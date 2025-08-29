import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet } from 'react-native';

export default function CustomDropdown({ label, options, selected, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  // Lọc theo name
  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Dropdown Button */}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setVisible(true)}>
        <Text style={{ color: selected ? '#000' : '#aaa' }}>{selected?.name || 'Chọn...'}</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent={true} visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdown}>
            {/* Search box */}
            <TextInput
              placeholder="Search options..."
              style={styles.searchBox}
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#999"
            />

            {/* Options */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => String(item.id || item.code || index)}
              renderItem={({ item }) => {
                const isSelected =
                  (selected?.id && selected.id === item.id) ||
                  (selected?.code && selected.code === item.code);

                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                      {item.name}
                    </Text>
                    {isSelected && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    maxHeight: 350,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: '#00b14f',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  optionText: { fontSize: 16, color: '#000' },
  selectedOption: { backgroundColor: '#f5f5f5' },
  selectedOptionText: { fontWeight: 'bold', color: '#000' },
  check: { color: '#00b14f', fontWeight: 'bold', fontSize: 16 },
});
