import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  avatar: { width: 200, height: 200, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  iconBtn: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#2196f3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
