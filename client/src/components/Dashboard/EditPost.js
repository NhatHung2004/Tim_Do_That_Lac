import React, { useEffect, useState } from 'react';
import { View, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import CustomDropdown from '../ui/CustomDropdown';
import Api, { AuthApi, endpoints } from '../../configs/Api';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import requestCameraPermission from '../../utils/RequestCamera';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatErrorMessages from '../../utils/FormatError';
import MyLoading from '../ui/MyLoading';
import styles from '../../styles/EditPostStyle';

export default function EditPost() {
  const route = useRoute();
  const navigation = useNavigation();
  const { post_id } = route.params;

  // Kiểm tra trạng thái edit
  const [originalData, setOriginalData] = useState(null); // Lưu dữ liệu hiện tại
  const [isDirty, setIsDirty] = useState(false); // Kiểm tra có dữ liệu có được sửa hay không
  const [loading, setLoading] = useState(false);

  // lưu data từ api
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  // lưu data đang chọn
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  // Khi back, nếu có thay đổi thì hỏi lại
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (!isDirty) return;
      e.preventDefault();
      Alert.alert('Xác nhận', 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?', [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Thoát',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });
  }, [navigation, isDirty]);

  // lấy ảnh từ thư viện
  const pickFromLibrary = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,
      quality: 0.8,
    };

    const res = await launchImageLibrary(options);
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Lỗi', res.errorMessage || 'Không thể chọn ảnh');
      return;
    }

    const assets = res.assets || [];
    const newImgs = assets.map((a, idx) => ({
      uri: a.uri,
      idx: `${Date.now()}_${idx}`, // những ảnh chọn mới sẽ thêm '_' để phân biệt với ảnh từ api
      isCover: false,
    }));
    setImages(prev => [...prev, ...newImgs]);
  };

  // mở camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission(); // xin quyền
    if (!hasPermission) return;

    const options = { mediaType: 'photo', quality: 0.8 };
    const res = await launchCamera(options);
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Lỗi', res.errorMessage || 'Không thể chụp ảnh');
      return;
    }
    const assets = res.assets || [];
    const newImgs = assets.map((a, idx) => ({
      uri: a.uri,
      idx: `${Date.now()}_${idx}`, // những ảnh chọn mới sẽ thêm '_' để phân biệt với ảnh từ api
      isCover: false,
    }));
    setImages(prev => [...prev, ...newImgs]);
  };

  // Hàm xoá ảnh bài đăng
  const deleteImage = async image_id => {
    try {
      console.log(image_id);
      const token = await AsyncStorage.getItem('token');
      await AuthApi(token).delete(endpoints.detelePostImage(image_id));

      setImages(prev => {
        const next = prev.filter(i => i.idx !== image_id);
        // nếu ảnh xoá là cover, set ảnh đầu tiên thành cover
        if (!next.some(i => i.isCover) && next.length > 0) {
          next[0].isCover = true;
        }
        return next;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // remove image
  const removeImage = idx => {
    Alert.alert('Xoá ảnh', 'Bạn có muốn xoá ảnh này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteImage(idx),
      },
    ]);
  };

  // chọn ảnh cover
  const setAsCover = id => {
    setImages(prev => prev.map(i => ({ ...i, isCover: i.idx === id })));
  };

  // Render 1 image
  const renderImageItem = item => (
    <View key={item.idx} style={styles.imageTile}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setAsCover(item.idx)}
        style={[styles.imageTouchable, item.isCover && styles.imageCoverBorder]}
      >
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>

      <View style={styles.imageFooter}>
        <Text numberOfLines={1} style={styles.imageLabel}>
          {item.isCover ? 'Ảnh chính' : ''}
        </Text>

        <View style={styles.imageActions}>
          <TouchableOpacity onPress={() => removeImage(item.idx)} style={styles.actionBtn}>
            <Text style={styles.actionText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Cập nhật data hiện tại để setIsDirty
  useEffect(() => {
    if (!originalData) return;

    const hasChanged =
      title !== originalData.title ||
      description !== originalData.description ||
      address !== originalData.location ||
      phone !== originalData.phone ||
      (selectedCategory?.id || selectedCategory) !== originalData.category ||
      selectedProvince?.name !== originalData.province ||
      selectedDistrict?.name !== originalData.district ||
      selectedWard?.name !== originalData.ward ||
      JSON.stringify(images.map(i => i.uri)) !==
        JSON.stringify(originalData.images.map(i => i.uri));

    setIsDirty(!hasChanged);
  }, [
    title,
    description,
    address,
    phone,
    selectedCategory,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    images,
    originalData,
  ]);

  // lấy chi tiết bài đăng
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await Api.get(endpoints.postDetail(post_id));

        const initImages = res.data.images.map((img, index) => ({
          uri: img.image,
          idx: img.id,
          isCover: index === 0,
        }));

        // dùng để kiểm tra có thay đổi dữ liệu không
        setOriginalData({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          phone: res.data.phone,
          category: res.data.category,
          province: res.data.province,
          district: res.data.district,
          ward: res.data.ward,
          images: initImages,
        });

        // set data đang chọn
        setImages(initImages);
        setPhone(res.data.phone);
        setSelectedWard({ name: res.data.ward });
        setSelectedDistrict({ name: res.data.district });
        setSelectedCategory(res.data.category);
        setDescription(res.data.description);
        setAddress(res.data.location);
        setTitle(res.data.title);

        // Trong lần đầu tiên mount cần phải gọi api để lấy dữ liệu vị trí
        const provincesRes = await axios.get('https://provinces.open-api.vn/api/p/');

        const provinceObj = provincesRes.data.find(p => p.name === res.data.province);
        setSelectedProvince(provinceObj);

        const districtsRes = await axios.get(
          `https://provinces.open-api.vn/api/p/${provinceObj.code}?depth=2`,
        );

        const districtObj = districtsRes.data.districts.find(d => d.name === res.data.district);

        setSelectedDistrict(districtObj);

        const wardsRes = await axios.get(
          `https://provinces.open-api.vn/api/d/${districtObj.code}?depth=2`,
        );

        const wardObj = wardsRes.data.wards.find(w => w.name === res.data.ward);

        setSelectedWard(wardObj);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApi();
  }, []);

  // Lấy danh sách tỉnh/thành phố từ API
  useEffect(() => {
    const fetchApiData = async () => {
      const res = await axios.get('https://provinces.open-api.vn/api/p/');
      setProvinces(res.data);
    };

    fetchApiData();
  }, [selectedProvince]);

  // lấy danh sách quận thuộc code thành phố
  useEffect(() => {
    const fetchApiData = async () => {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`,
      );
      setDistricts(res.data.districts);
    };

    fetchApiData();
  }, [selectedProvince]);

  // Lấy danh sách xã thuộc code huyện
  useEffect(() => {
    const fetchApiData = async () => {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`,
      );
      setWards(res.data.wards);
    };

    fetchApiData();
  }, [selectedDistrict]);

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get(endpoints['categories']);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Hàm cập nhật bài đăng (PATCH chỉ gửi trường thay đổi)
  const updatePost = async () => {
    setIsDirty(false);
    if (!originalData) return;

    // chứa những trường có thay đổi
    const payload = {};

    // kiểm tra từng trường có khác với original dât không, nếu khác thì thêm vào payload
    if (title !== originalData.title) payload.title = title;
    if (description !== originalData.description) payload.description = description;
    if (address !== originalData.location) payload.location = address;
    if (phone !== originalData.phone) payload.phone = phone;

    if (selectedCategory && selectedCategory !== originalData.category) {
      payload.category_id = selectedCategory.id || selectedCategory;
    }

    if (selectedProvince && selectedProvince.name !== originalData.province) {
      payload.province = selectedProvince.name;
    }

    if (selectedDistrict && selectedDistrict.name !== originalData.district) {
      payload.district = selectedDistrict.name;
    }

    if (selectedWard && selectedWard.name !== originalData.ward) {
      payload.ward = selectedWard.name;
    }

    // ảnh mới (chỉ gửi ảnh mới thêm, idx có "_"), những ảnh lấy từ api sẽ không có '_'
    const newImages = images.filter(img => img.idx.toString().includes('_'));
    if (newImages.length > 0) {
      payload.images = newImages.map((img, index) => ({
        uri: img.uri,
        type: 'image/jpeg',
        name: `photo_${index}.jpg`,
      }));
    }

    if (Object.keys(payload).length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa thay đổi thông tin nào.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });

      newImages.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          type: 'images/jpeg',
          name: `photo_${index}.jpg`,
        });
      });

      const res = await AuthApi(token).patch(endpoints.postDetail(post_id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // cập nhật lại originalData theo response
      const updatedData = res.data;
      const updatedImages = updatedData.images.map((img, index) => ({
        uri: img.image,
        idx: img.id,
        isCover: index === 0,
      }));

      setOriginalData({
        title: updatedData.title,
        description: updatedData.description,
        location: updatedData.location,
        phone: updatedData.phone,
        category: updatedData.category,
        province: updatedData.province,
        district: updatedData.district,
        ward: updatedData.ward,
        images: updatedImages,
      });

      setImages(updatedImages);

      setIsDirty(false);
      Alert.alert('Thành công', 'Bài đăng đã được cập nhật!');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        Alert.alert('Lỗi cập nhật', formatErrorMessages(error.response.data));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, marginBottom: 10 }}
      contentContainerStyle={styles.container}
      extraScrollHeight={120} // khoảng trống thêm khi bàn phím mở
      enableOnAndroid={true} // bật cho Android
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        label="Tiêu đề"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        cursorColor={Colors.black}
        activeOutlineColor={Colors.secondary}
        textColor={Colors.black}
      />

      <TextInput
        label="Mô tả"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={[styles.input, styles.textarea]}
        multiline
        cursorColor={Colors.black}
        activeOutlineColor={Colors.secondary}
        textColor={Colors.black}
      />

      {/* Hình ảnh */}
      <Text style={styles.label}>Hình ảnh</Text>

      {images.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Chưa có ảnh</Text>
        </View>
      ) : (
        <View style={styles.columnWrapper}>{images.map(img => renderImageItem(img))}</View>
      )}

      {/* buttons add image */}
      <View style={styles.addRow}>
        <TouchableOpacity style={styles.addBtn} onPress={pickFromLibrary}>
          <Text style={styles.addBtnText}>Chọn ảnh từ thư viện</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.addBtn, styles.cameraBtn]} onPress={openCamera}>
          <Text style={styles.addBtnText}>Chụp ảnh</Text>
        </TouchableOpacity>
      </View>

      {/* selected cover preview */}
      {images.length > 0 && (
        <View style={styles.selectedPreview}>
          <Text style={styles.subLabel}>Ảnh đã chọn:</Text>
          <View style={styles.previewBox}>
            {images.find(i => i.isCover) ? (
              <Image
                source={{ uri: images.find(i => i.isCover).uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{ uri: images[0].uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      )}

      <CustomDropdown
        label="Danh mục"
        options={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <CustomDropdown
        label="Tỉnh"
        options={provinces}
        selected={selectedProvince}
        onSelect={setSelectedProvince}
      />

      <CustomDropdown
        label="Quận/huyện"
        options={districts}
        selected={selectedDistrict}
        onSelect={setSelectedDistrict}
      />

      <CustomDropdown
        label="Xã"
        options={wards}
        selected={selectedWard}
        onSelect={setSelectedWard}
      />

      {/* Address */}
      <TextInput
        label="Địa chỉ chi tiết *"
        value={address}
        onChangeText={setAddress}
        mode="outlined"
        style={styles.input}
        cursorColor={Colors.black}
        activeOutlineColor={Colors.secondary}
        textColor={Colors.black}
      />

      {/* Address */}
      <TextInput
        label="Số điện thoại *"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        cursorColor={Colors.black}
        activeOutlineColor={Colors.secondary}
        textColor={Colors.black}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button mode="contained" style={{ flex: 1, marginRight: 5 }} onPress={updatePost}>
          {loading ? <MyLoading color={Colors.primary} /> : 'Cập nhật tin đăng'}
        </Button>
      </View>

      {/* Warning */}
      <Text style={styles.warning}>
        Vui lòng thay đổi ít nhất một thông tin để cập nhật tin đăng.
      </Text>
    </KeyboardAwareScrollView>
  );
}
