// src/components/CustomInput.js
import { View, TextInput, StyleSheet, Text } from 'react-native';

const CustomInput = ({
  value,
  setValue,
  placeholder,
  keyboardType,
  error,
  secureTextEntry = false,
}) => {
  return (
    <>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[styles.input, error ? styles.inputError : {}]}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#E04F5F',
    backgroundColor: '#fff7f7',
  },
  errorText: {
    color: '#E04F5F',
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default CustomInput;
