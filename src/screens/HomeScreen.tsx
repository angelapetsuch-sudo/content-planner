import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Storage, STORAGE_KEYS} from '../utils/storage';
import {PDFGenerator} from '../utils/pdfGenerator';
import {Expense, Sponsorship, Analytics, ContentIdea, SubscriptionStatus} from '../types';
import {format, startOfMonth, endOfMonth} from 'date-fns';

const HomeScreen = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalRevenue: 0,
    activeSponsors: 0,
    contentIdeas: 0,
  });
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    tier: 'free',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const expenses = (await Storage.getData<Expense[]>(STORAGE_KEYS.EXPENSES)) || [];
      const sponsorships = (await Storage.getData<Sponsorship[]>(STORAGE_KEYS.SPONSORSHIPS)) || [];
      const ideas = (await Storage.getData<ContentIdea[]>(STORAGE_KEYS.CONTENT_IDEAS)) || [];
      const sub = (await Storage.getData<SubscriptionStatus>(STORAGE_KEYS.SUBSCRIPTION)) || {
        isActive: false,
        tier: 'free',
      };

      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const monthlyExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });

      const activeSponsors = sponsorships.filter(
        s => s.status === 'active' || s.status === 'pending'
      );

      const totalRevenue = sponsorships
        .filter(s => s.status === 'completed' || s.status === 'active')
        .reduce((sum, s) => sum + s.amount, 0);

      setStats({
        totalExpenses: monthlyExpenses.reduce((sum, e) => sum + e.amount, 0),
        totalRevenue,
        activeSponsors: activeSponsors.length,
        contentIdeas: ideas.filter(i => i.status === 'idea').length,
      });

      setSubscription(sub);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const generateMonthlyReport = async () => {
    if (!subscription.isActive) {
      Alert.alert(
        'Premium Feature',
        'PDF export is a premium feature. Upgrade to Premium for $4.99/month to unlock this and other features!',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Upgrade', onPress: () => Alert.alert('Upgrade', 'Navigate to subscription screen')},
        ]
      );
      return;
    }

    setIsGenerating(true);
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const expenses = (await Storage.getData<Expense[]>(STORAGE_KEYS.EXPENSES)) || [];
      const sponsorships = (await Storage.getData<Sponsorship[]>(STORAGE_KEYS.SPONSORSHIPS)) || [];
      const analytics = (await Storage.getData<Analytics[]>(STORAGE_KEYS.ANALYTICS)) || [];
      const ideas = (await Storage.getData<ContentIdea[]>(STORAGE_KEYS.CONTENT_IDEAS)) || [];

      const monthlyData = {
        expenses: expenses.filter(e => {
          const d = new Date(e.date);
          return d >= monthStart && d <= monthEnd;
        }),
        sponsorships: sponsorships.filter(s => {
          const d = new Date(s.startDate);
          return d >= monthStart && d <= monthEnd;
        }),
        analytics: analytics.filter(a => {
          const d = new Date(a.date);
          return d >= monthStart && d <= monthEnd;
        }),
        contentIdeas: ideas.filter(i => {
          const d = new Date(i.createdAt);
          return d >= monthStart && d <= monthEnd;
        }),
        month: format(now, 'MMMM'),
        year: format(now, 'yyyy'),
      };

      const filePath = await PDFGenerator.generateMonthlyReport(monthlyData);
      Alert.alert('Success', `Report generated successfully!\n\nSaved to: ${filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Creator Dashboard</Text>
        <Text style={styles.subtitle}>
          {subscription.isActive ? 'Premium Member ⭐' : 'Free Plan'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.totalExpenses.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Monthly Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.revenue]}>
            ${stats.totalRevenue.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeSponsors}</Text>
          <Text style={styles.statLabel}>Active Sponsors</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.contentIdeas}</Text>
          <Text style={styles.statLabel}>Content Ideas</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={generateMonthlyReport}
          disabled={isGenerating}>
          <Text style={styles.actionButtonText}>
            {isGenerating ? 'Generating...' : 'Generate Monthly PDF Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={loadDashboardData}>
          <Text style={styles.actionButtonText}>Refresh Dashboard</Text>
        </TouchableOpacity>
      </View>

      {!subscription.isActive && (
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Unlock Premium Features</Text>
          <Text style={styles.upgradeText}>
            • Unlimited PDF exports{'\n'}
            • Advanced AI content generation{'\n'}
            • Priority support{'\n'}
            • Custom branding
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>
              Upgrade for $4.99/month
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  statCard: {
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  revenue: {
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeCard: {
    margin: 20,
    backgroundColor: '#fef3c7',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  upgradeText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 22,
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
