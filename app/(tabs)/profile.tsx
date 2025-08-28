import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { icons } from '@/constants/icons';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    // Load saved profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedName = await AsyncStorage.getItem('user_name');
                const savedEmail = await AsyncStorage.getItem('user_email');
                const savedBio = await AsyncStorage.getItem('user_bio');
                const savedAvatar = await AsyncStorage.getItem('user_avatar');
                if (savedName) setName(savedName);
                if (savedEmail) setEmail(savedEmail);
                if (savedBio) setBio(savedBio);
                if (savedAvatar) setAvatar(savedAvatar);
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };
        loadProfile();
    }, []);

    // Save profile
    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('user_name', name);
            await AsyncStorage.setItem('user_email', email);
            await AsyncStorage.setItem('user_bio', bio);
            if (avatar) {
                await AsyncStorage.setItem('user_avatar', avatar);
            } else {
                await AsyncStorage.removeItem('user_avatar');
            }
            Alert.alert('✅ Success', 'Profile saved successfully');
        } catch (err) {
            console.error('Error saving profile:', err);
            Alert.alert('❌ Error', 'Could not save profile');
        }
    };

    // Pick image from gallery
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'We need access to your gallery');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    // Take photo with camera
    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'We need access to your camera');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    // Remove photo
    const removePhoto = () => {
        setAvatar(null);
        AsyncStorage.removeItem('user_avatar');
        Alert.alert('🗑️ Removed', 'Profile photo has been reset');
    };

    return (
        <SafeAreaView className="bg-primary flex-1 px-6">
            <View className="flex items-center mt-10">
                <Image
                    source={avatar ? { uri: avatar } : icons.person}
                    className="w-28 h-28 rounded-full bg-dark-200 p-5"
                    tintColor={avatar ? undefined : "#fff"}
                />

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-dark-100 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white">📂 Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={takePhoto}
                        className="bg-dark-100 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white">📷 Camera</Text>
                    </TouchableOpacity>

                    {avatar && (
                        <TouchableOpacity
                            onPress={removePhoto}
                            className="bg-red-500 px-4 py-2 rounded-lg"
                        >
                            <Text className="text-white">🗑 Remove</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text className="text-white text-xl font-bold mt-6">My Profile</Text>
            </View>

            {/* Input Fields */}
            <View className="mt-8">
                <Text className="text-light-200 mb-1">Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#888"
                    className="bg-dark-100 text-white rounded-lg px-4 py-3 mb-4"
                />

                <Text className="text-light-200 mb-1">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    className="bg-dark-100 text-white rounded-lg px-4 py-3 mb-4"
                />

                <Text className="text-light-200 mb-1">Bio</Text>
                <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell something about yourself"
                    placeholderTextColor="#888"
                    multiline
                    className="bg-dark-100 text-white rounded-lg px-4 py-3 h-24 mb-6"
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity
                onPress={handleSave}
                className="bg-accent py-4 rounded-xl items-center mt-4"
            >
                <Text className="text-white font-semibold text-base">Save Profile</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Profile;
