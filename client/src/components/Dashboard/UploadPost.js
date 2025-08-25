import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import Api, { endpoints, AuthApi } from '../../configs/Api';
import { MyUserContext } from '../../configs/MyContext';
import MyLoading from '../ui/MyLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Button, Menu } from 'react-native-paper';

const { width } = Dimensions.get('window');

const UploadPost = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ name: 'Tất cả danh mục', id: null });

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSelect = item => {
    setSelectedCategory(item);
    closeMenu();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Api.get(endpoints['categories']);
        setCategories(res.data);
      } catch (error) {
        console.error('Error in UploadPost component:', error);
      }
    };
    fetchCategories();
  }, []);

  const [popularTags, setPopularTags] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { type, msg } = route.params;
  const user = useContext(MyUserContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false); // Điều khiển hiển thị modal địa chỉ
  const [specificAddress, setSpecificAddress] = useState(''); // Địa chỉ cụ thể do người dùng nhập

  // State cho dữ liệu địa chỉ từ API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State cho các lựa chọn địa chỉ
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // 'province', 'district', 'ward'
  const [modalListType, setModalListType] = useState(null);
  // State cho từ khóa tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState('');

  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch các tag phổ biến
  useEffect(() => {
    const fetchPopularTags = async () => {
      const token = await AsyncStorage.getItem('token');

      try {
        const response = await AuthApi(token).get(endpoints['tags']);
        setPopularTags(response.data);
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      }
    };

    fetchPopularTags();
  }, []);

  // Xử lý upload bài đăng
  const handleUpPost = async () => {
    setLoading(true);
    if (!title || !description || !location || !selectedCategory.id) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (tiêu đề, mô tả, địa chỉ...).');
      setLoading(false);
      return;
    }

    if (user) {
      const token = await AsyncStorage.getItem('token');
      const user_id = user.current_user.id;
      const category_id = selectedCategory.id;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('district', selectedDistrict ? selectedDistrict.name : '');
      formData.append('province', selectedProvince ? selectedProvince.name : '');
      formData.append('ward', selectedWard ? selectedWard.name : '');
      formData.append('location', specificAddress);
      formData.append('type', type);
      formData.append('user_id', user_id);
      formData.append('category_id', category_id);
      formData.append('tags', JSON.stringify(tags)); // chuyển đổi thành JSON
      console.log('Selected Images:', formData);
      selectedImages.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          name: image.name || image.uri.split('/').pop(),
          type: image.type || 'image/jpeg',
        });
      });

      try {
        await AuthApi(token).post(endpoints['posts'], formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Alert.alert('Thông báo', 'Tạo tin thành công');
        navigation.navigate('dashboard');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Chọn ảnh từ thư viện
  const choosePhotos = () => {
    ImageCropPicker.openPicker({
      multiple: true, // Cho phép chọn nhiều ảnh
      mediaType: 'photo',
      cropping: false, // Không tự động cắt ảnh sau khi chọn
      compressImageQuality: 0.8, // Chất lượng nén ảnh (0-1)
      maxFiles: 6,
    })
      .then(images => {
        const newImages = images.map(image => ({ uri: image.path }));
        setSelectedImages(prevImages => [...prevImages, ...newImages]);
      })
      .catch(e => {
        console.log('Image picker cancelled or error: ', e);
        if (e.code === 'E_PICKER_CANCELLED') {
        } else if (e.code === 'E_NO_CAMERA_PERMISSION' || e.code === 'E_NO_LIBRARY_PERMISSION') {
          Alert.alert('Lỗi quyền', 'Vui lòng cấp quyền truy cập thư viện/camera trong cài đặt.');
        } else {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi chọn ảnh.');
        }
      });
  };

  // Xoá ảnh đã chọn
  const handleRemoveImage = indexToRemove => {
    setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
  };

  // Sử dụng máy ảnh
  const takePhoto = () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: true, // Cho phép cắt ảnh sau khi chụp
      width: 300,
      height: 400,
      compressImageQuality: 0.8,
    })
      .then(image => {
        console.log(image);
        setSelectedImages(prevImages => [
          ...prevImages,
          {
            uri: image.path,
            name: image.filename || image.path.split('/').pop(),
            type: image.mime,
          },
        ]);
      })
      .catch(e => {
        console.log('Camera cancelled or error: ', e);
        if (e.code === 'E_PICKER_CANCELLED') {
        } else {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi chụp ảnh.');
        }
      });
  };

  // Fetch provinces khi component mount
  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error('Error fetching provinces:', err));
  }, []);

  // Mở danh sách quận/huyện khi chọn tỉnh/thành phố
  const handleSelectProvince = async province => {
    setSelectedProvince(province);
    // Reset district và ward khi chọn lại tỉnh
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSearchKeyword('');
    setModalListType('district'); // Chuyển sang hiển thị danh sách quận/huyện
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
      setDistricts(res.data.districts);
    } catch (err) {
      console.error('Error fetching districts:', err);
      setDistricts([]);
    }
  };

  // Mở danh sách phường/xã khi chọn quận/huyện
  const handleSelectDistrict = async district => {
    setSelectedDistrict(district);
    // Reset ward khi chọn lại quận
    setSelectedWard(null);
    setSearchKeyword('');
    // Chuyển sang hiển thị danh sách phường/xã
    setModalListType('ward');
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
      setWards(res.data.wards);
    } catch (err) {
      console.error('Error fetching wards:', err);
      setWards([]);
    }
  };

  // Chọn phường/xã
  const handleSelectWard = ward => {
    setSelectedWard(ward);
    setModalListType(null); // Đóng danh sách lựa chọn
    setSearchKeyword('');
  };

  // Đóng modal lồng
  const closeModalList = () => {
    setModalListType(null); // Đóng danh sách lựa chọn trong modal
    setSearchKeyword('');
  };

  const closeAddressModal = () => {
    // Đóng modal địa chỉ
    setIsAddressModalVisible(false);
    setModalListType(null); // Reset trạng thái danh sách khi đóng modal chính
    setSearchKeyword('');

    setLocation(displayAddress());
  };

  // Hiển thị địa chỉ đã chọn trên trường input chính
  const displayAddress = () => {
    let addressParts = [];
    if (specificAddress) addressParts.push(specificAddress);
    if (selectedWard) addressParts.push(selectedWard.name);
    if (selectedDistrict) addressParts.push(selectedDistrict.name);
    if (selectedProvince) addressParts.push(selectedProvince.name);
    return addressParts.join(', ') || 'Chọn tỉnh / thành phố';
  };

  const renderAddressItem = (item, selectHandler) => (
    <TouchableOpacity style={styles.addressItem} onPress={() => selectHandler(item)}>
      <Text style={styles.addressItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Hàm lọc dữ liệu địa chỉ dựa trên từ khóa tìm kiếm
  const getFilteredData = () => {
    let dataToFilter = [];
    if (modalListType === 'province') {
      dataToFilter = provinces;
    } else if (modalListType === 'district') {
      dataToFilter = districts;
    } else if (modalListType === 'ward') {
      dataToFilter = wards;
    }

    if (searchKeyword) {
      const lowercasedKeyword = searchKeyword.toLowerCase();
      return dataToFilter.filter(item => item.name.toLowerCase().includes(lowercasedKeyword));
    }
    return dataToFilter;
  };

  // Hàm thêm tag mới
  const handleAddTag = newTag => {
    if (newTag && !tags.includes(newTag) && tags.length < 3) {
      setTags([...tags, newTag]);
    }
    setTag(''); // Reset trường nhập tag sau khi thêm
  };

  // Hàm xoá tag
  const handleRemoveTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <AntDesign name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{msg}</Text>
        </View>
        <KeyboardAwareScrollView
          style={styles.scrollViewContent}
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 150}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Thông tin chi tiết */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>THÔNG TIN CHI TIẾT</Text>

            {/* Upload Image Section */}
            {selectedImages.length <= 0 ? (
              <TouchableOpacity style={styles.imageUploadBox} onPress={choosePhotos}>
                <View style={styles.imageUploadHint}>
                  <MaterialCommunityIcons name="information-outline" size={16} color="#007bff" />
                  <Text style={styles.imageUploadHintText}> Hình ảnh hợp lệ</Text>
                </View>
                <AntDesign name="camera" size={50} color="#ffaa00" />
                <Text style={styles.imageUploadText}>ĐĂNG TỪ 01 ĐẾN 06 HÌNH</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                contentContainerStyle={{ flexDirection: 'row', paddingVertical: 10 }}
              >
                <TouchableOpacity style={styles.addImageButton} onPress={choosePhotos}>
                  <AntDesign name="camera" size={20} color={Colors.primary} />
                  <Text style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}>
                    Thêm hình
                  </Text>
                </TouchableOpacity>

                {/* Hiển thị các ảnh đã chọn */}
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: image.uri }}
                      style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={{ color: Colors.white, fontSize: 12, fontWeight: 'bold' }}>
                        X
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Địa chỉ */}
            <Text style={styles.inputLabel}>
              Địa chỉ <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                // Mở modal
                setIsAddressModalVisible(true);
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: Colors.textDark,
                }}
                placeholder="Chọn tỉnh / thành phố"
                editable={false} // Không cho phép nhập trực tiếp
                value={displayAddress()} // Hiển thị địa chỉ đã chọn
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TIÊU ĐỀ TIN ĐĂNG VÀ MÔ TẢ CHI TIẾT</Text>

            {/* Title Input */}
            <Text style={styles.inputLabel}>
              Tiêu đề tin đăng <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tiêu đề..."
              placeholderTextColor={Platform.OS === 'android' && Colors.textGray}
              maxLength={50}
              value={title}
              onChangeText={text => setTitle(text)}
            />
            <Text style={styles.charCount}>{title.length}/50</Text>

            {/* Category Input */}
            <Text style={styles.inputLabel}>
              Thư mục <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.inputLabel}>
              <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                  <Button
                    onPress={openMenu}
                    mode="outlined"
                    style={styles.menuButton}
                    contentStyle={styles.menuButtonContent}
                    labelStyle={styles.menuButtonLabel}
                    icon="chevron-down"
                  >
                    {selectedCategory.name}
                  </Button>
                }
              >
                {categories.map((category, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => handleSelect(category)}
                    title={category.name}
                  />
                ))}
              </Menu>
            </View>

            {/* Description Input */}
            <Text style={[styles.inputLabel, { marginTop: 20 }]}>
              Mô tả chi tiết <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              multiline
              placeholder="Nhập mô tả..."
              placeholderTextColor={Platform.OS === 'android' && Colors.textGray}
              numberOfLines={8}
              value={description}
              onChangeText={text => setDescription(text)}
              textAlignVertical="top"
            />

            {/* Tag Input */}
            <Text style={[styles.inputLabel, { marginTop: 20 }]}>Tags (Nhập để tạo tag mới)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.textInput}
                placeholder={tags.length === 3 ? 'Đã đạt giới hạn 3 tag' : 'Nhập tag...'}
                placeholderTextColor={Platform.OS === 'android' && Colors.textGray}
                maxLength={50}
                value={tag}
                onChangeText={text => setTag(text)}
                editable={tags.length < 3} // Không cho phép nhập nếu đã đủ 3 tag
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddTag(tag)}
                disabled={tags.length === 3}
              >
                <Text>Thêm</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  style={styles.tagItem}
                  key={index}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close-circle" size={16} color="#007bff" />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 10, color: Colors.textGray }}>
              Tags phổ biến:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {popularTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularTagItem}
                  onPress={() => handleAddTag(tag.name)}
                >
                  <Text>
                    <Text style={{ color: '#007bff' }}>+</Text> {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Thêm tags giúp bài đăng dễ tìm kiếm hơn. Tối đa 3 tags.
            </Text>
          </View>
        </KeyboardAwareScrollView>

        {/* Upload Button */}
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.postButton} onPress={handleUpPost} disabled={loading}>
            {loading ? <MyLoading /> : <Text style={styles.postButtonText}>ĐĂNG TIN</Text>}
          </TouchableOpacity>
        </View>

        {/** MODAL ADDRESS */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddressModalVisible}
          onRequestClose={closeAddressModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeAddressModal}>
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Địa chỉ</Text>
                <View style={{ width: 20 }} />
              </View>

              {/* Modal Body - Address Selection Inputs */}
              <View style={styles.addressSelectionArea}>
                {/* PROVINCE */}
                <Text style={styles.inputLabel}>
                  Tỉnh, thành phố <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.addressSelectorInput}
                  onPress={() => setModalListType('province')}
                >
                  <Text style={styles.selectorText}>
                    {selectedProvince?.name || 'Chọn tỉnh / thành phố'}
                  </Text>
                </TouchableOpacity>

                {/* DISTRICT */}
                <Text style={styles.inputLabel}>
                  Quận, huyện, thị xã <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.addressSelectorInput, !selectedProvince && styles.disabledInput]}
                  onPress={() => selectedProvince && setModalListType('district')}
                  disabled={!selectedProvince}
                >
                  <Text style={styles.selectorText}>
                    {selectedDistrict?.name || 'Chọn quận/huyện'}
                  </Text>
                </TouchableOpacity>

                {/* WARD */}
                <Text style={styles.inputLabel}>
                  Phường, xã, thị trấn <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.addressSelectorInput, !selectedDistrict && styles.disabledInput]}
                  onPress={() => selectedDistrict && setModalListType('ward')}
                  disabled={!selectedDistrict}
                >
                  <Text style={styles.selectorText}>{selectedWard?.name || 'Chọn phường/xã'}</Text>
                </TouchableOpacity>

                {/* ĐỊA CHỈ CỤ THỂ */}
                <Text style={styles.inputLabel}>Địa chỉ cụ thể</Text>
                <TextInput
                  style={styles.specificAddressTextInput}
                  placeholder="Nhập địa chỉ cụ thể"
                  value={specificAddress}
                  onChangeText={setSpecificAddress}
                />
              </View>

              {/* Modal Footer - Complete Button for Address */}
              <TouchableOpacity style={styles.completeButton} onPress={closeAddressModal}>
                <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Nested Modal for List Selection (Province, District, Ward) */}
        <Modal
          visible={!!modalListType}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModalList}
        >
          <View style={styles.nestedModalContainer}>
            <View style={styles.nestedModalContent}>
              <View style={styles.nestedModalHeader}>
                <TouchableOpacity onPress={closeModalList} style={styles.nestedModalHeaderLeft}>
                  <AntDesign name="close" size={24} color={Colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.nestedModalTitle}>
                  {modalListType === 'province'
                    ? 'Chọn tỉnh, thành phố'
                    : modalListType === 'district'
                      ? 'Chọn quận, huyện'
                      : 'Chọn phường, xã'}
                </Text>
                <View style={styles.nestedModalHeaderRight}>
                  {/* Có thể thêm nút "Tìm kiếm" ở đây nếu muốn */}
                </View>
              </View>

              {/* Ô tìm kiếm */}
              <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color={Colors.textGray} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập từ khoá để lọc"
                  value={searchKeyword}
                  onChangeText={setSearchKeyword}
                />
              </View>

              <FlatList
                data={getFilteredData()}
                keyExtractor={item => item.code.toString()}
                renderItem={({ item }) =>
                  renderAddressItem(
                    item,
                    modalListType === 'province'
                      ? handleSelectProvince
                      : modalListType === 'district'
                        ? handleSelectDistrict
                        : handleSelectWard,
                  )
                }
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  scrollViewContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },

  // IMAGE UPLOAD
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
    marginBottom: 15,
    position: 'relative',
  },
  imageUploadHint: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadHintText: {
    color: Colors.link,
    fontSize: 12,
    marginLeft: 3,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginTop: 10,
  },
  addImageButton: {
    width: 130,
    height: 130,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 130,
    height: 130,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ADDRESS INPUT
  inputLabel: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
  },
  requiredStar: {
    color: 'red',
  },

  // VIDEO UPLOAD
  videoUploadBox: {
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
    marginBottom: 20,
    position: 'relative',
  },
  videoUploadHint: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoUploadHintText: {
    color: '#007bff',
    fontSize: 12,
    marginLeft: 3,
  },
  videoUploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginTop: 10,
  },
  videoUploadSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
    marginBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.textDark,
    backgroundColor: Colors.white,
  },
  descriptionInput: {
    height: 120,
    paddingTop: 10,
  },

  // BUTON ĐĂNG TIN
  footerButtons: {
    flexDirection: 'row',
    paddingLeft: 13,
    paddingRight: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f0f2f5',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 15 : 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  addressSelectionArea: {
    // Vùng chứa các input chọn địa chỉ trong modal
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addressSelectorInput: {
    // Input dùng để mở modal chọn tỉnh/huyện/xã
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  specificAddressTextInput: {
    // Text input cho địa chỉ cụ thể
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  completeButton: {
    // Nút "HOÀN THÀNH" của modal chính
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  // Nested Modal (Province/District/Ward List)
  nestedModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  nestedModalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  nestedModalHeader: {
    // Header mới cho nested modal
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Điều chỉnh padding top
  },
  nestedModalHeaderLeft: {
    // Để icon X sát bên trái
    paddingRight: 15,
  },
  nestedModalHeaderRight: {
    // Để nút/icon "Tìm kiếm" ở bên phải
    width: 24,
  },
  searchBox: {
    // Style cho ô tìm kiếm
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25, // Bo tròn góc
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 15,
    backgroundColor: Colors.white,
  },
  searchInput: {
    flex: 1,
    height: 40, // Chiều cao của input
    fontSize: 16,
    color: Colors.textDark,
    marginLeft: 10,
  },
  // Mỗi item trong FlatList của nested modal
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  addressItemText: {
    fontSize: 16,
    color: Colors.textDark,
  },

  tagItem: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  tagText: {
    marginRight: 5,
    flexShrink: 1,
  },
  popularTagItem: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },

  // Menu button styles
  menuButton: {
    width: '100%',
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  menuButtonContent: {
    flexDirection: 'row-reverse',
  },
  menuButtonLabel: {
    textAlign: 'left',
    flex: 1,
    color: Colors.textDark,
  },
});

export default UploadPost;
