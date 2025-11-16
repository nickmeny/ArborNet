import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Fictional Reward Data (Prizes) ---
interface Reward {
    id: number;
    name: string;
    cost: number;
    icon: string;
    description: string;
}

const rewards: Reward[] = [
    { id: 1, name: 'OASA 3 day card', cost: 300, icon: '', description: 'Free rides on public transport for 3 days' },
    { id: 2, name: 'Athens Card Points', cost: 300, icon: '', description: 'Free Athens card points' },
    { id: 3, name: '5% off for Cinema Tickets', cost: 500, icon: '', description: 'A discount on your next movie ticket purchase.' },
    { id: 4, name: '1 free Scooter ride with lime', cost: 700, icon: '', description: ''},
    { id: 5, name: '50% off for Uber Taxi', cost: 1000, icon: '', description: '50% off for one ride with a urban taxi' },
];
// --- End of Fictional Data ---

// Define the tab param list for this screen
type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Prices: undefined; // Assuming this screen is named 'Prices' in the tab navigator
};

type PricesScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Prices'>;

export default function PricesScreen() {
  // Use useNavigation hook with the correct type
  const navigation = useNavigation<PricesScreenNavigationProp>();
  // Dummy user token balance for display purposes
  const userTokens = 1550; 

  const handleRedeem = (reward: Reward) => {
      // In a real app, this would trigger an API call to redeem the item
      alert(`Attempting to redeem "${reward.name}" for ${reward.cost} tokens!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>🏆 The Reward Vault</Text>
            <View style={styles.tokenDisplay}>
                <Text style={styles.tokenText}>💰 {userTokens} Tokens</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {rewards.map(reward => {
                const canAfford = userTokens >= reward.cost;
                return (
                    <View key={reward.id} style={styles.rewardCard}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.iconText}>{reward.icon}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.rewardName}>{reward.name}</Text>
                            <Text style={styles.rewardDescription}>{reward.description}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.redeemButton, !canAfford && styles.disabledButton]}
                            onPress={() => handleRedeem(reward)}
                            disabled={!canAfford}
                        >
                            <Text style={styles.redeemText}>
                                {canAfford ? `${reward.cost} Tokens` : 'Locked'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1E2B4E', // Deep background color
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#2C3E50', // Dark header background
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#3498DB', // A vibrant line
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ECF0F1', // Light text for contrast
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    tokenDisplay: {
        backgroundColor: '#F39C12', // Gold/Yellow color for tokens
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    tokenText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#2C3E50',
    },
    scrollViewContent: {
        padding: 10,
    },
    rewardCard: {
        flexDirection: 'row',
        backgroundColor: '#34495E', // Slightly lighter card background
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        borderLeftWidth: 5,
        borderLeftColor: '#E74C3C', // A bold color highlight
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#BDC3C7', // Icon background
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconText: {
        fontSize: 28,
    },
    details: {
        flex: 1,
        marginRight: 10,
    },
    rewardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3498DB', // Use a vibrant color for the name
    },
    rewardDescription: {
        fontSize: 12,
        color: '#BDC3C7',
        marginTop: 2,
    },
    redeemButton: {
        backgroundColor: '#2ECC71', // Green for 'Can Afford'
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#95A5A6', // Gray for 'Locked'
    },
    redeemText: {
        color: '#ECF0F1',
        fontWeight: 'bold',
        fontSize: 14,
    },
});