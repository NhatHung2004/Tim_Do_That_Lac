import { ActivityIndicator } from 'react-native';
import Colors from '../../constants/colors';

export default function MyLoading({ color }) {
  return <ActivityIndicator size="large" color={color || Colors.white} />;
}
