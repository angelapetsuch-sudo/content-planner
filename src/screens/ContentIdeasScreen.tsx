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
import {ContentIdea} from '../types';
import {format} from 'date-fns';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];
const STATUSES = ['idea', 'planned', 'in-progress', 'completed'];

const ContentIdeasScreen = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    platform: 'Instagram',
    tags: '',
  });

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    const data = await Storage.getData<ContentIdea[]>(STORAGE_KEYS.CONTENT_IDEAS);
    if (data) {
      setIdeas(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const addIdea = async () => {
    if (!newIdea.title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const idea: ContentIdea = {
      id: Date.now().toString(),
      title: newIdea.title,
      description: newIdea.description,
      platform: newIdea.platform,
      status: 'idea',
      createdAt: new Date().toISOString(),
      tags: newIdea.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    const updatedIdeas = [idea, ...ideas];
    await Storage.saveData(STORAGE_KEYS.CONTENT_IDEAS, updatedIdeas);
    setIdeas(updatedIdeas);
    setModalVisible(false);
    setNewIdea({title: '', description: '', platform: 'Instagram', tags: ''});
  };

  const updateStatus = async (id: string, newStatus: typeof STATUSES[number]) => {
    const updated = ideas.map(idea =>
      idea.id === id ? {...idea, status: newStatus as ContentIdea['status']} : idea
    );
    await Storage.saveData(STORAGE_KEYS.CONTENT_IDEAS, updated);
    setIdeas(updated);
  };

  const deleteIdea = async (id: string) => {
    Alert.alert('Delete Idea', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = ideas.filter(i => i.id !== id);
          await Storage.saveData(STORAGE_KEYS.CONTENT_IDEAS, updated);
          setIdeas(updated);
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea':
        return '#9ca3af';
      case 'planned':
        return '#3b82f6';
      case 'in-progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#9ca3af';
    }
  };

  const renderIdea = ({item}: {item: ContentIdea}) => (
    <View style={styles.ideaCard}>
      <View style={styles.ideaHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.ideaTitle}>{item.title}</Text>
          <Text style={styles.ideaPlatform}>{item.platform}</Text>
          {item.description ? (
            <Text style={styles.ideaDescription}>{item.description}</Text>
          ) : null}
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={styles.ideaDate}>
            {format(new Date(item.createdAt), 'MMM dd, yyyy')}
          </Text>
        </View>
        <TouchableOpacity onLongPress={() => deleteIdea(item.id)}>
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

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ideas.filter(i => i.status === 'idea').length}</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ideas.filter(i => i.status === 'planned').length}</Text>
          <Text style={styles.statLabel}>Planned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ideas.filter(i => i.status === 'in-progress').length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ideas.filter(i => i.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      <FlatList
        data={ideas}
        renderItem={renderIdea}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No content ideas yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first idea</Text>
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
            <Text style={styles.modalTitle}>New Content Idea</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter idea title"
              value={newIdea.title}
              onChangeText={text => setNewIdea({...newIdea, title: text})}
            />

            <Text style={styles.label}>Platform</Text>
            <View style={styles.platformContainer}>
              {PLATFORMS.map(platform => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    newIdea.platform === platform && styles.platformButtonActive,
                  ]}
                  onPress={() => setNewIdea({...newIdea, platform})}>
                  <Text
                    style={[
                      styles.platformButtonText,
                      newIdea.platform === platform && styles.platformButtonTextActive,
                    ]}>
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your content idea..."
              multiline
              numberOfLines={4}
              value={newIdea.description}
              onChangeText={text => setNewIdea({...newIdea, description: text})}
            />

            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. tutorial, vlog, tips"
              value={newIdea.tags}
              onChangeText={text => setNewIdea({...newIdea, tags: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addIdea}>
                <Text style={styles.addButtonText}>Add Idea</Text>
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
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  listContent: {
    padding: 15,
  },
  ideaCard: {
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
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ideaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  ideaPlatform: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 8,
  },
  ideaDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  ideaDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  deleteHint: {
    fontSize: 24,
    color: '#9ca3af',
    paddingHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#4f46e5',
  },
  statusButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 6,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
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
    minHeight: 100,
    textAlignVertical: 'top',
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

export default ContentIdeasScreen;
