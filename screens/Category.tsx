import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParams } from '../App'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AppParams, 'Category'>
type Intent = {
    id: string,
    name: string
}

const items = [
    { id: '1', name: 'navigate_home' },
    { id: '2', name: 'navigate_appointments' },
    { id: '3', name: 'navigate_setting' },
    { id: '4', name: 'select_doctor' },
    { id: '5', name: 'book_appointment' },
    { id: '6', name: 'reschedule_appointment' },
    { id: '7', name: 'cancel_appointment' },
    { id: '8', name: 'increase_font_size' },
    { id: '9', name: 'decrease_font_size' },
    { id: '10', name: 'set_language_english' },
    { id: '11', name: 'set_language_urdu' },
    { id: '12', name: 'turn_on_notifications' },
    { id: '13', name: 'turn_off_notifications' },
    { id: '14', name: 'enable_color_blindness' },
    { id: '15', name: 'disable_color_blindness' },
    { id: '16', name: 'set_protanopia_mode' },
    { id: '17', name: 'set_deuteranopia_mode' },
    { id: '18', name: 'set_tritanopia_mode' },
    { id: '19', name: 'select_orthodontics' },
    { id: '20', name: 'select_prosthodontics' },
    { id: '21', name: 'select_endodontics' },
    { id: '22', name: 'select_periodontics' },
    { id: '23', name: 'select_pedodontics' },
    { id: '24', name: 'select_oral_surgery' },
];


const Category: React.FC<Props> = ({navigation}) => {

    const handleDownloadCSV = async () => { 
        try {
            const savedData = await AsyncStorage.getItem('csvData');
            let csvData
            if (savedData) {
                csvData =JSON.parse(savedData)
              }

            const csvString = csvData.join('\n');
            const fileUri = `${FileSystem.documentDirectory}urdu_dataset.png`;
            
            await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
            
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission required', 'Please grant permission to save the file.');
              return;
            }

            const asset = await MediaLibrary.createAssetAsync(fileUri);
            const album = await MediaLibrary.getAlbumAsync('Downloads');
            if (album == null) {
              await MediaLibrary.createAlbumAsync('Downloads', asset, false);
            } else {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
      
            Alert.alert('Success', 'CSV file saved to Downloads folder');
          } catch (error) {
            console.error('Error saving CSV:', error);
            Alert.alert('Error', 'Failed to save CSV file');
          }
     }

    const handlePress = (name: string) => {
        navigation.navigate('Record', { intentName: name });
      };
    
      const renderItem = ({ item } : {item: Intent}) => (
        <TouchableOpacity onPress={() => handlePress(item.name)} style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      );
      
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
        <View style={styles.buttonContainer}>
          <Button title="Download CSV" onPress={handleDownloadCSV} />
        </View>
      </View>
    </SafeAreaView>

  )
}

export default Category

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    list: {
      flex: 1,
    },
    item: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    buttonContainer: {
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
  });