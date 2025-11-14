import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {Storage, STORAGE_KEYS} from '../utils/storage';
import {Analytics} from '../types';
import {format} from 'date-fns';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];

const AnalyticsScreen = () => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    platform: 'Instagram',
    followers: '',
    engagement: '',
    reach: '',
    impressions: '',
    newFollowers: '',
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await Storage.getData<Analytics[]>(STORAGE_KEYS.ANALYTICS);
    if (data) {
      setAnalytics(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const addAnalytics = async () => {
    if (!newEntry.followers || !newEntry.engagement) {
      Alert.alert('Error', 'Please enter at least followers and engagement');
      return;
    }

    const entry: Analytics = {
      id: Date.now().toString(),
      platform: newEntry.platform,
      date: new Date().toISOString(),
      followers: parseInt(newEntry.followers) || 0,
      engagement: parseFloat(newEntry.engagement) || 0,
      reach: parseInt(newEntry.reach) || 0,
      impressions: parseInt(newEntry.impressions) || 0,
      newFollowers: parseInt(newEntry.newFollowers) || 0,
    };

    const updated = [entry, ...analytics];
    await Storage.saveData(STORAGE_KEYS.ANALYTICS, updated);
    setAnalytics(updated);
    setModalVisible(false);
    setNewEntry({
      platform: 'Instagram',
      followers: '',
      engagement: '',
      reach: '',
      impressions: '',
      newFollowers: '',
    });
  };

  const deleteEntry = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = analytics.filter(a => a.id !== id);
          await Storage.saveData(STORAGE_KEYS.ANALYTICS, updated);
          setAnalytics(updated);
        },
      },
    ]);
  };

  const getAverageEngagement = () => {
    if (analytics.length === 0) return 0;
    const sum = analytics.reduce((acc, a) => acc + a.engagement, 0);
    return (sum / analytics.length).toFixed(2);
  };

  const getTotalFollowers = () => {
    const byPlatform: {[key: string]: number} = {};
    analytics.forEach(a => {
      if (!byPlatform[a.platform] || new Date(a.date) > new Date(byPlatform[a.platform])) {
        byPlatform[a.platform] = a.followers;
      }
    });
    return Object.values(byPlatform).reduce((sum, f) => sum + f, 0);
  };

  const renderAnalyticsCard = (item: Analytics) => (
    <View key={item.id} style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.platform}>{item.platform}</Text>
          <Text style={styles.date}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
        </View>
        <TouchableOpacity onLongPress={() => deleteEntry(item.id)}>
          <Text style={styles.deleteHint}>...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{item.followers.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Followers</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{item.engagement.toFixed(1)}%</Text>
          <Text style={styles.metricLabel}>Engagement</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{item.reach.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Reach</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{item.impressions.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Impressions</Text>
        </View>
      </View>

      {item.newFollowers > 0 && (
        <View style={styles.newFollowersTag}>
          <Text style={styles.newFollowersText}>
            +{item.newFollowers} new followers
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{getTotalFollowers().toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Followers</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{getAverageEngagement()}%</Text>
              <Text style={styles.summaryLabel}>Avg Engagement</Text>
            </View>
          </View>
        </View>

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>Analytics History</Text>
          {analytics.length > 0 ? (
            analytics.map(renderAnalyticsCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No analytics data yet</Text>
              <Text style={styles.emptySubtext}>Tap + to add your first entry</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Analytics</Text>

            <Text style={styles.label}>Platform</Text>
            <View style={styles.platformContainer}>
              {PLATFORMS.map(platform => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    newEntry.platform === platform && styles.platformButtonActive,
                  ]}
                  onPress={() => setNewEntry({...newEntry, platform})}>
                  <Text
                    style={[
                      styles.platformButtonText,
                      newEntry.platform === platform && styles.platformButtonTextActive,
                    ]}>
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Followers *</Text>
            <TextInput
              style={styles.input}
              placeholder="Total followers"
              keyboardType="number-pad"
              value={newEntry.followers}
              onChangeText={text => setNewEntry({...newEntry, followers: text})}
            />

            <Text style={styles.label}>Engagement Rate (%) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4.5"
              keyboardType="decimal-pad"
              value={newEntry.engagement}
              onChangeText={text => setNewEntry({...newEntry, engagement: text})}
            />

            <Text style={styles.label}>Reach</Text>
            <TextInput
              style={styles.input}
              placeholder="Total reach"
              keyboardType="number-pad"
              value={newEntry.reach}
              onChangeText={text => setNewEntry({...newEntry, reach: text})}
            />

            <Text style={styles.label}>Impressions</Text>
            <TextInput
              style={styles.input}
              placeholder="Total impressions"
              keyboardType="number-pad"
              value={newEntry.impressions}
              onChangeText={text => setNewEntry({...newEntry, impressions: text})}
            />

            <Text style={styles.label}>New Followers</Text>
            <TextInput
              style={styles.input}
              placeholder="Gained this period"
              keyboardType="number-pad"
              value={newEntry.newFollowers}
              onChangeText={text => setNewEntry({...newEntry, newFollowers: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addAnalytics}>
                <Text style={styles.addButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  summarySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
  entriesSection: {
    padding: 20,
    paddingTop: 0,
  },
  analyticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  platform: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  deleteHint: {
    fontSize: 24,
    color: '#9ca3af',
    paddingHorizontal: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metric: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  newFollowersTag: {
    marginTop: 12,
    backgroundColor: '#d1fae5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  newFollowersText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6366f1',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  platformContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  platformButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  platformButtonText: {
    fontSize: 14,
    color: '#4b5563',
  },
  platformButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6366f1',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AnalyticsScreen;
