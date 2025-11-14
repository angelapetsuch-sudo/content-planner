import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {Storage, STORAGE_KEYS} from '../utils/storage';
import {Sponsorship} from '../types';
import {format} from 'date-fns';

const STATUSES: Sponsorship['status'][] = ['pending', 'active', 'completed', 'rejected'];

const SponsorshipsScreen = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    brand: '',
    amount: '',
    deliverables: '',
    notes: '',
  });

  useEffect(() => {
    loadSponsorships();
  }, []);

  const loadSponsorships = async () => {
    const data = await Storage.getData<Sponsorship[]>(STORAGE_KEYS.SPONSORSHIPS);
    if (data) {
      setSponsorships(data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    }
  };

  const addSponsorship = async () => {
    if (!newSponsor.brand || !newSponsor.amount) {
      Alert.alert('Error', 'Please enter brand name and amount');
      return;
    }

    const sponsorship: Sponsorship = {
      id: Date.now().toString(),
      brand: newSponsor.brand,
      amount: parseFloat(newSponsor.amount),
      status: 'pending',
      startDate: new Date().toISOString(),
      deliverables: newSponsor.deliverables,
      notes: newSponsor.notes,
    };

    const updated = [sponsorship, ...sponsorships];
    await Storage.saveData(STORAGE_KEYS.SPONSORSHIPS, updated);
    setSponsorships(updated);
    setModalVisible(false);
    setNewSponsor({brand: '', amount: '', deliverables: '', notes: ''});
  };

  const updateStatus = async (id: string, newStatus: Sponsorship['status']) => {
    const updated = sponsorships.map(s =>
      s.id === id
        ? {
            ...s,
            status: newStatus,
            endDate: newStatus === 'completed' ? new Date().toISOString() : s.endDate,
          }
        : s
    );
    await Storage.saveData(STORAGE_KEYS.SPONSORSHIPS, updated);
    setSponsorships(updated);
  };

  const deleteSponsorship = async (id: string) => {
    Alert.alert('Delete Sponsorship', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = sponsorships.filter(s => s.id !== id);
          await Storage.saveData(STORAGE_KEYS.SPONSORSHIPS, updated);
          setSponsorships(updated);
        },
      },
    ]);
  };

  const getStatusColor = (status: Sponsorship['status']) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'active':
        return '#10b981';
      case 'completed':
        return '#6366f1';
      case 'rejected':
        return '#ef4444';
    }
  };

  const renderSponsorship = ({item}: {item: Sponsorship}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.brandName}>{item.brand}</Text>
          <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.date}>
            Started: {format(new Date(item.startDate), 'MMM dd, yyyy')}
          </Text>
          {item.deliverables && (
            <Text style={styles.deliverables}>
              Deliverables: {item.deliverables}
            </Text>
          )}
          {item.notes && <Text style={styles.notes}>Note: {item.notes}</Text>}
        </View>
        <TouchableOpacity onLongPress={() => deleteSponsorship(item.id)}>
          <Text style={styles.deleteHint}>...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusButtons}>
        {STATUSES.map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              item.status === status && {
                backgroundColor: getStatusColor(status),
              },
            ]}
            onPress={() => updateStatus(item.id, status)}>
            <Text
              style={[
                styles.statusButtonText,
                item.status === status && styles.statusButtonTextActive,
              ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const totalRevenue = sponsorships
    .filter(s => s.status === 'completed' || s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const activeDeal = sponsorships.filter(s => s.status === 'active' || s.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>${totalRevenue.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Deals</Text>
          <Text style={styles.statValue}>{activeDeal.length}</Text>
        </View>
      </View>

      <FlatList
        data={sponsorships}
        renderItem={renderSponsorship}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sponsorships yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first deal</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

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
            <Text style={styles.modalTitle}>New Sponsorship</Text>

            <Text style={styles.label}>Brand Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter brand name"
              value={newSponsor.brand}
              onChangeText={text => setNewSponsor({...newSponsor, brand: text})}
            />

            <Text style={styles.label}>Amount ($) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={newSponsor.amount}
              onChangeText={text => setNewSponsor({...newSponsor, amount: text})}
            />

            <Text style={styles.label}>Deliverables</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What content will you create?"
              multiline
              numberOfLines={3}
              value={newSponsor.deliverables}
              onChangeText={text => setNewSponsor({...newSponsor, deliverables: text})}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional notes..."
              multiline
              numberOfLines={3}
              value={newSponsor.notes}
              onChangeText={text => setNewSponsor({...newSponsor, notes: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addSponsorship}>
                <Text style={styles.addButtonText}>Add Deal</Text>
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
  statsBar: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  listContent: {
    padding: 15,
  },
  card: {
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
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  deliverables: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    lineHeight: 20,
  },
  notes: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 6,
  },
  deleteHint: {
    fontSize: 24,
    color: '#9ca3af',
    paddingHorizontal: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 6,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
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
    maxHeight: '85%',
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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

export default SponsorshipsScreen;
