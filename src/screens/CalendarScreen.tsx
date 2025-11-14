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
import {Calendar} from 'react-native-calendars';
import {Storage, STORAGE_KEYS} from '../utils/storage';
import {Post} from '../types';
import {format} from 'date-fns';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];
const STATUSES: Post['status'][] = ['scheduled', 'published', 'draft'];

const CalendarScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: 'Instagram',
    content: '',
    hook: '',
    caption: '',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await Storage.getData<Post[]>(STORAGE_KEYS.POSTS);
    if (data) {
      setPosts(data);
    }
  };

  const addPost = async () => {
    if (!newPost.content.trim()) {
      Alert.alert('Error', 'Please enter content description');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      date: selectedDate,
      platform: newPost.platform,
      content: newPost.content,
      hook: newPost.hook,
      caption: newPost.caption,
      status: 'scheduled',
    };

    const updated = [...posts, post];
    await Storage.saveData(STORAGE_KEYS.POSTS, updated);
    setPosts(updated);
    setModalVisible(false);
    setNewPost({platform: 'Instagram', content: '', hook: '', caption: ''});
  };

  const updatePostStatus = async (id: string, newStatus: Post['status']) => {
    const updated = posts.map(p => (p.id === id ? {...p, status: newStatus} : p));
    await Storage.saveData(STORAGE_KEYS.POSTS, updated);
    setPosts(updated);
  };

  const deletePost = async (id: string) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = posts.filter(p => p.id !== id);
          await Storage.saveData(STORAGE_KEYS.POSTS, updated);
          setPosts(updated);
        },
      },
    ]);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    posts.forEach(post => {
      if (!marked[post.date]) {
        marked[post.date] = {
          marked: true,
          dots: [],
        };
      }
      const color =
        post.status === 'published'
          ? '#10b981'
          : post.status === 'scheduled'
          ? '#6366f1'
          : '#9ca3af';
      marked[post.date].dots.push({color});
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#6366f1',
    };

    return marked;
  };

  const getPostsForDate = (date: string) => {
    return posts.filter(p => p.date === date);
  };

  const selectedPosts = getPostsForDate(selectedDate);

  const getStatusColor = (status: Post['status']) => {
    switch (status) {
      case 'scheduled':
        return '#6366f1';
      case 'published':
        return '#10b981';
      case 'draft':
        return '#9ca3af';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Calendar
          current={selectedDate}
          onDayPress={day => setSelectedDate(day.dateString)}
          markingType={'multi-dot'}
          markedDates={getMarkedDates()}
          theme={{
            selectedDayBackgroundColor: '#6366f1',
            todayTextColor: '#6366f1',
            arrowColor: '#6366f1',
            monthTextColor: '#1f2937',
            textMonthFontWeight: 'bold',
          }}
        />

        <View style={styles.postsSection}>
          <View style={styles.postsHeader}>
            <Text style={styles.postsTitle}>
              Posts for {format(new Date(selectedDate), 'MMM dd, yyyy')}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+ Add Post</Text>
            </TouchableOpacity>
          </View>

          {selectedPosts.length > 0 ? (
            selectedPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={{flex: 1}}>
                    <View style={styles.platformStatusRow}>
                      <Text style={styles.platform}>{post.platform}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {backgroundColor: getStatusColor(post.status)},
                        ]}>
                        <Text style={styles.statusBadgeText}>{post.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.postContent}>{post.content}</Text>
                    {post.hook && (
                      <Text style={styles.postHook}>Hook: {post.hook}</Text>
                    )}
                    {post.caption && (
                      <Text style={styles.postCaption} numberOfLines={3}>
                        {post.caption}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onLongPress={() => deletePost(post.id)}>
                    <Text style={styles.deleteHint}>...</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statusButtons}>
                  {STATUSES.map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        post.status === status && {
                          backgroundColor: getStatusColor(status),
                        },
                      ]}
                      onPress={() => updatePostStatus(post.id, status)}>
                      <Text
                        style={[
                          styles.statusButtonText,
                          post.status === status && styles.statusButtonTextActive,
                        ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts scheduled for this day</Text>
              <Text style={styles.emptySubtext}>Tap "Add Post" to schedule content</Text>
            </View>
          )}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#6366f1'}]} />
              <Text style={styles.legendText}>Scheduled</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#10b981'}]} />
              <Text style={styles.legendText}>Published</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#9ca3af'}]} />
              <Text style={styles.legendText}>Draft</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Post</Text>
            <Text style={styles.modalSubtitle}>
              {format(new Date(selectedDate), 'MMMM dd, yyyy')}
            </Text>

            <Text style={styles.label}>Platform</Text>
            <View style={styles.platformButtons}>
              {PLATFORMS.map(platform => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    newPost.platform === platform && styles.platformButtonActive,
                  ]}
                  onPress={() => setNewPost({...newPost, platform})}>
                  <Text
                    style={[
                      styles.platformButtonText,
                      newPost.platform === platform && styles.platformButtonTextActive,
                    ]}>
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Content Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What will you post about?"
              multiline
              numberOfLines={3}
              value={newPost.content}
              onChangeText={text => setNewPost({...newPost, content: text})}
            />

            <Text style={styles.label}>Hook (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your attention-grabbing hook"
              value={newPost.hook}
              onChangeText={text => setNewPost({...newPost, hook: text})}
            />

            <Text style={styles.label}>Caption (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your full caption with hashtags"
              multiline
              numberOfLines={4}
              value={newPost.caption}
              onChangeText={text => setNewPost({...newPost, caption: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addPost}>
                <Text style={styles.saveButtonText}>Schedule Post</Text>
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
  postsSection: {
    padding: 20,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  platformStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platform: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    marginBottom: 6,
  },
  postHook: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  postCaption: {
    fontSize: 13,
    color: '#6b7280',
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
    paddingVertical: 6,
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 5,
  },
  legend: {
    padding: 20,
    paddingTop: 0,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#6b7280',
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
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
  platformButtons: {
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
  saveButton: {
    backgroundColor: '#6366f1',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CalendarScreen;
