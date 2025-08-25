import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import Colors from '../../constants/colors';

export default function BottomSheet() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [specificAddress, setSpecificAddress] = useState('');

  const [modalType, setModalType] = useState(null); // province | district | ward

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.log(err));
  }, []);

  const openDistricts = async province => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setModalType(null);
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
    setDistricts(res.data.districts);
  };

  const openWards = async district => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setModalType(null);
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
    setWards(res.data.wards);
  };

  const renderItem = (item, onPress) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Tỉnh, thành phố *</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalType('province')}>
        <Text>{selectedProvince?.name || 'Chọn tỉnh/thành phố'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Quận, huyện, thị xã *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => selectedProvince && setModalType('district')}
      >
        <Text>{selectedDistrict?.name || 'Chọn quận/huyện'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Phường, xã, thị trấn *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => selectedDistrict && setModalType('ward')}
      >
        <Text>{selectedWard?.name || 'Chọn phường/xã'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Địa chỉ cụ thể</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Nhập địa chỉ cụ thể"
        value={specificAddress}
        onChangeText={setSpecificAddress}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() =>
          console.log({ selectedProvince, selectedDistrict, selectedWard, specificAddress })
        }
      >
        <Text style={{ color: 'white' }}>HOÀN THÀNH</Text>
      </TouchableOpacity>

      {/* Modal Chọn Địa Chỉ */}
      <Modal visible={!!modalType} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'province'
                ? 'Chọn Tỉnh/Thành phố'
                : modalType === 'district'
                  ? 'Chọn Quận/Huyện'
                  : 'Chọn Phường/Xã'}
            </Text>
            <FlatList
              data={
                modalType === 'province' ? provinces : modalType === 'district' ? districts : wards
              }
              keyExtractor={item => item.code.toString()}
              renderItem={({ item }) =>
                renderItem(
                  item,
                  modalType === 'province'
                    ? openDistricts
                    : modalType === 'district'
                      ? openWards
                      : ward => {
                          setSelectedWard(ward);
                          setModalType(null);
                        },
                )
              }
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalType(null)}>
              <Text style={{ color: 'white' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5 },
  textInput: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5 },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeBtn: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
