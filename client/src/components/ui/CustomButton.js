import { Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

const CustomButton = ({
  onPress,
  text,
  type = 'PRIMARY',
  bgColor,
  fgColor,
  disabled = false,
  loading = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
        disabled || loading ? styles.container_DISABLED : {}, // Thêm trạng thái loading
        pressed && !(disabled || loading) ? { opacity: 0.7 } : {},
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={fgColor || styles.text_PRIMARY.color} />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${type}`],
            fgColor ? { color: fgColor } : {},
            disabled || loading ? styles.text_DISABLED : {},
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 8,
  },

  container_PRIMARY: {
    backgroundColor: '#3B71F3', // Màu xanh dương chủ đạo
  },

  container_TERTIARY: {
    backgroundColor: 'transparent',
  },

  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },

  container_DISABLED: {
    backgroundColor: '#a0a0a0',
  },

  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },

  text_TERTIARY: {
    color: 'gray',
  },

  text_SECONDARY: {
    color: '#3B71F3',
  },

  text_DISABLED: {
    color: '#e0e0e0',
  },
});

export default CustomButton;
