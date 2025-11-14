import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {AIService} from '../utils/aiService';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'General'];

const AIToolsScreen = () => {
  const [activeTab, setActiveTab] = useState<'hook' | 'caption' | 'idea' | 'sounds'>('hook');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Hook generator state
  const [hookTopic, setHookTopic] = useState('');
  const [hookPlatform, setHookPlatform] = useState('Instagram');

  // Caption generator state
  const [captionHook, setCaptionHook] = useState('');
  const [captionPlatform, setCaptionPlatform] = useState('Instagram');

  // Trending sounds
  const [soundPlatform, setSoundPlatform] = useState('TikTok');
  const [trendingSounds, setTrendingSounds] = useState<any[]>([]);

  const generateHook = async () => {
    if (!hookTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const hook = await AIService.generateHook(hookTopic, hookPlatform);
      setResult(hook);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate hook');
    } finally {
      setLoading(false);
    }
  };

  const generateCaption = async () => {
    if (!captionHook.trim()) {
      Alert.alert('Error', 'Please enter a hook or topic');
      return;
    }

    setLoading(true);
    try {
      const caption = await AIService.generateCaption(captionHook, captionPlatform);
      setResult(caption);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const generateIdea = async () => {
    setLoading(true);
    try {
      const idea = await AIService.generateIdea();
      setResult(
        `Title: ${idea.title}\n\nPlatform: ${idea.platform}\n\nDescription:\n${idea.description}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate idea');
    } finally {
      setLoading(false);
    }
  };

  const getTrendingSounds = async () => {
    setLoading(true);
    try {
      const sounds = await AIService.getTrendingSounds(soundPlatform);
      setTrendingSounds(sounds);
      setResult('');
    } catch (error) {
      Alert.alert('Error', 'Failed to get trending sounds');
    } finally {
      setLoading(false);
    }
  };

  const renderHookGenerator = () => (
    <View style={styles.generatorContainer}>
      <Text style={styles.subtitle}>Generate attention-grabbing hooks for your content</Text>

      <Text style={styles.label}>Topic</Text>
      <TextInput
        style={styles.input}
        placeholder="What's your content about?"
        value={hookTopic}
        onChangeText={setHookTopic}
        multiline
      />

      <Text style={styles.label}>Platform</Text>
      <View style={styles.platformButtons}>
        {PLATFORMS.map(platform => (
          <TouchableOpacity
            key={platform}
            style={[
              styles.platformButton,
              hookPlatform === platform && styles.platformButtonActive,
            ]}
            onPress={() => setHookPlatform(platform)}>
            <Text
              style={[
                styles.platformButtonText,
                hookPlatform === platform && styles.platformButtonTextActive,
              ]}>
              {platform}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateHook}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Hook</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderCaptionGenerator = () => (
    <View style={styles.generatorContainer}>
      <Text style={styles.subtitle}>Create engaging captions with hashtags</Text>

      <Text style={styles.label}>Hook or Topic</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your hook or main topic..."
        value={captionHook}
        onChangeText={setCaptionHook}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Platform</Text>
      <View style={styles.platformButtons}>
        {PLATFORMS.map(platform => (
          <TouchableOpacity
            key={platform}
            style={[
              styles.platformButton,
              captionPlatform === platform && styles.platformButtonActive,
            ]}
            onPress={() => setCaptionPlatform(platform)}>
            <Text
              style={[
                styles.platformButtonText,
                captionPlatform === platform && styles.platformButtonTextActive,
              ]}>
              {platform}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateCaption}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Caption</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderIdeaGenerator = () => (
    <View style={styles.generatorContainer}>
      <Text style={styles.subtitle}>Get fresh content ideas tailored for creators</Text>

      <View style={styles.ideaInfo}>
        <Text style={styles.ideaInfoText}>
          Generate creative content ideas based on trending topics and proven formats
        </Text>
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateIdea}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Idea</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderTrendingSounds = () => (
    <View style={styles.generatorContainer}>
      <Text style={styles.subtitle}>Discover trending sounds for your platform</Text>

      <Text style={styles.label}>Platform</Text>
      <View style={styles.platformButtons}>
        {['TikTok', 'Instagram', 'YouTube'].map(platform => (
          <TouchableOpacity
            key={platform}
            style={[
              styles.platformButton,
              soundPlatform === platform && styles.platformButtonActive,
            ]}
            onPress={() => setSoundPlatform(platform)}>
            <Text
              style={[
                styles.platformButtonText,
                soundPlatform === platform && styles.platformButtonTextActive,
              ]}>
              {platform}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={getTrendingSounds}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.generateButtonText}>Get Trending Sounds</Text>
        )}
      </TouchableOpacity>

      {trendingSounds.length > 0 && (
        <View style={styles.soundsList}>
          {trendingSounds.map((sound, index) => (
            <View key={index} style={styles.soundCard}>
              <View style={styles.soundHeader}>
                <Text style={styles.soundName}>{sound.name}</Text>
                <View style={styles.popularityBadge}>
                  <Text style={styles.popularityText}>{sound.popularity}%</Text>
                </View>
              </View>
              <Text style={styles.soundArtist}>{sound.artist}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hook' && styles.tabActive]}
          onPress={() => {
            setActiveTab('hook');
            setResult('');
            setTrendingSounds([]);
          }}>
          <Text style={[styles.tabText, activeTab === 'hook' && styles.tabTextActive]}>
            Hooks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'caption' && styles.tabActive]}
          onPress={() => {
            setActiveTab('caption');
            setResult('');
            setTrendingSounds([]);
          }}>
          <Text style={[styles.tabText, activeTab === 'caption' && styles.tabTextActive]}>
            Captions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'idea' && styles.tabActive]}
          onPress={() => {
            setActiveTab('idea');
            setResult('');
            setTrendingSounds([]);
          }}>
          <Text style={[styles.tabText, activeTab === 'idea' && styles.tabTextActive]}>
            Ideas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sounds' && styles.tabActive]}
          onPress={() => {
            setActiveTab('sounds');
            setResult('');
            setTrendingSounds([]);
          }}>
          <Text style={[styles.tabText, activeTab === 'sounds' && styles.tabTextActive]}>
            Sounds
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'hook' && renderHookGenerator()}
        {activeTab === 'caption' && renderCaptionGenerator()}
        {activeTab === 'idea' && renderIdeaGenerator()}
        {activeTab === 'sounds' && renderTrendingSounds()}

        {result !== '' && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Generated Content:</Text>
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{result}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                Alert.alert('Copied!', 'Content copied to clipboard');
              }}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  generatorContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
  generateButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ideaInfo: {
    backgroundColor: '#e0e7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  ideaInfoText: {
    fontSize: 14,
    color: '#4f46e5',
    lineHeight: 20,
  },
  resultContainer: {
    padding: 20,
    paddingTop: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  resultBox: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 150,
  },
  resultText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  copyButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  soundsList: {
    marginTop: 20,
  },
  soundCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  soundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  soundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  popularityBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularityText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  soundArtist: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default AIToolsScreen;
