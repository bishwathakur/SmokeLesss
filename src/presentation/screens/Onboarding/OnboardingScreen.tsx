/**
 * Onboarding Screen
 * First-time user setup flow
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSmokingStore } from '../../store/smokingStore';
import { useDailyLimit } from '../../hooks/useDailyLimit';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { User, createUser } from '../../../domain/entities/User';
import { SQLiteDatabase } from '../../../infrastructure/database/SQLiteDataBase';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import uuid from 'react-native-uuid';
import BrandSelector from '../../components/BrandSelector/BrandSelector';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentUser } = useSmokingStore();
  const { calculateAndSetLimit } = useDailyLimit();

  const [dailyLimitData, setDailyLimitData] = useState<{ recommended: number } | null>(null);

  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [smokingStartAge, setSmokingStartAge] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Changed to array

  const handleNext = () => {
    if (step === 1) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 18) {
        Alert.alert('Invalid Age', 'Please enter a valid age (18 or older)');
        return;
      }
      // Store the result instead of just calling it
      const limitData = calculateAndSetLimit(ageNum);
      setDailyLimitData(limitData);
      setStep(2);
    } else if (step === 2) {
      const startAge = parseInt(smokingStartAge, 10);
      if (isNaN(startAge) || startAge < 0) {
        Alert.alert('Invalid Age', 'Please enter a valid age');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      console.log("Next clicked on preferred brand selection")
      setStep(4);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      const ageNum = parseInt(age, 10);
      const startAge = parseInt(smokingStartAge, 10);
      const limitData = calculateAndSetLimit(ageNum);

      // Initialize database
      await SQLiteDatabase.getInstance().initialize();

      // Create user
      const userId = uuid.v4() as string;
      const user = createUser(
        userId,
        ageNum,
        new Date(),
        startAge,
        limitData.recommended,
        selectedBrands
      );

      // Save to database
      const repository = new UserRepository();
      await repository.createUser(user);

      // Set in store
      setCurrentUser(user);

      Alert.alert('Welcome!', 'Your profile has been created successfully.');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    }
  };

  // Updated addBrand function to handle multiple types
  const addBrand = () => {
    if (selectedBrand && selectedTypes.length > 0) {
      // Create brand entries for each selected type
      const brandEntries = selectedTypes.map(type =>
        `${selectedBrand} - ${type}`
      );

      // Add all brand-type combinations
      setSelectedBrands([...selectedBrands, ...brandEntries]);
      setSelectedBrand('');
      setSelectedTypes([]);
    } else if (selectedBrand && !selectedBrands.includes(selectedBrand)) {
      // Fallback: if no types selected, just add the brand
      setSelectedBrands([...selectedBrands, selectedBrand]);
      setSelectedBrand('');
      setSelectedTypes([]);
    }
  };

  // Handler to toggle type selection
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Remove type if already selected
        return prev.filter(t => t !== type);
      } else {
        // Add type if not selected
        return [...prev, type];
      }
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>What's your age?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>When did you start smoking?</Text>
            <TextInput
              style={styles.input}
              placeholder="Age when you started"
              value={smokingStartAge}
              onChangeText={setSmokingStartAge}
              keyboardType="numeric"
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Select your preferred brands</Text>
            <BrandSelector
              selectedBrand={selectedBrand}
              selectedTypes={selectedTypes} // Pass array instead of single type
              onBrandSelect={setSelectedBrand}
              onTypeSelect={handleTypeToggle} // Use toggle handler
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                (!selectedBrand || selectedTypes.length === 0) && styles.addButtonDisabled
              ]}
              onPress={addBrand}
              disabled={!selectedBrand || selectedTypes.length === 0}
            >
              <Text style={styles.addButtonText}>Add Brand{selectedTypes.length > 1 ? 's' : ''}</Text>
            </TouchableOpacity>
            {selectedBrands.length > 0 && (
              <View style={styles.brandsList}>
                {selectedBrands.map((brand, index) => (
                  <View key={index} style={styles.brandChip}>
                    <Text style={styles.brandChipText}>{brand}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      case 4:
        // return (
        //   <View>
        //     <Text style={styles.stepTitle}>You're all set!</Text>
        //     <Text style={styles.stepDescription}>
        //       Your daily limit has been set to {calculateAndSetLimit(parseInt(age, 10)).recommended} cigarettes.
        //     </Text>
        //   </View>
        // );
        return (
          <View>
            <Text style={styles.stepTitle}>You're all set!</Text>
            <Text style={styles.stepDescription}>
              {/* ✅ FIXED - Use stored state instead of calling function */}
              Your daily limit has been set to {dailyLimitData?.recommended || 0} cigarettes.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome to Smoking Regulation</Text>
      <Text style={styles.subtitle}>Let's set up your profile</Text>

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Step {step} of 4</Text>
      </View>

      {renderStep()}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step === 4 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  stepIndicator: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  stepTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 16,
  },
  stepDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.textLight,
  },
  backButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    ...Typography.button,
    color: Colors.textLight,
  },
  brandsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  brandChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  brandChipText: {
    ...Typography.bodySmall,
    color: Colors.textLight,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});

export default OnboardingScreen;

