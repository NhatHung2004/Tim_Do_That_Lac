import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { AuthApi, endpoints } from '../../configs/Api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MyUserContext } from '../../configs/MyContext';
import Colors from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useContext(MyUserContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, []),
  );

  const fetchStats = async () => {
    try {
      const res = await AuthApi().get(endpoints.userStats);
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <>
          <Text style={styles.header}>📊 Thống kê của bạn</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tổng số bài đăng</Text>
            <Text style={styles.cardValue}>{stats.total_posts}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đồ đã tìm thấy</Text>
            <Text style={styles.cardValue}>{stats.found_posts}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đồ đang chờ</Text>
            <Text style={styles.cardValue}>{stats.pending_posts}</Text>
          </View>

          <Text style={styles.subHeader}>📈 Bài đăng theo tháng</Text>
          <BarChart
            data={{
              labels: stats.monthly.map(m => m.month),
              datasets: [{ data: stats.monthly.map(m => m.count) }],
            }}
            width={screenWidth - 16}
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 12,
            }}
          />
        </>
      ) : (
        <>
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: Colors.black, fontWeight: 'bold' }}
          >
            Vui lòng đăng nhập để xem thông báo
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={{ color: Colors.white, fontSize: 16 }}>Đăng nhập</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, color: '#555' },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
});
