import { Button, PermissionsAndroid, Platform, StyleSheet, Text, View, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParams } from '../App'
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AppParams, 'Record'>

const Record: React.FC<Props> = ({navigation, route}) => {
    const { intentName } = route.params
    const [ microphoneResult, setMicrophoneResult ] = useState<string>();
    const [ isListening, setIsListening ] = useState<boolean>(false);
    const [ csvData, setCsvData ] = useState<string[]>([]);
    const [ filteredData, setFilteredData ] = useState<string[]>([]);

    useEffect(() => {
        loadCSVData();
    }, []);

    const loadCSVData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('csvData');
          if (savedData) {
            const parsedData = JSON.parse(savedData) as string[];
            setCsvData(parsedData);
            const filtered = parsedData.filter(line => line.endsWith(`,${intentName}`));
            setFilteredData(filtered);          }
        } catch (error) {
          console.error('Error loading CSV data:', error);
        }
      };

    useEffect(() => {      
        loadCSVData();
        
        Voice.onSpeechError = () => {
            setIsListening(false);
        }
        
        Voice.onSpeechResults = speechResult => {
            if(speechResult.value){
                setMicrophoneResult(speechResult.value[0])
            }
            setIsListening(false);
        }

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, []);

    const startSpeechRecognition = async () => {
        if (Platform.OS === 'android') {
            const voicePermissionReq = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );
            if (voicePermissionReq === PermissionsAndroid.RESULTS.GRANTED) {
                Voice.start('ur-PK', {
                    EXTRA_PREFER_OFFLINE: true
                });
                setIsListening(true)
            } else {
                console.log("Microphone permission denied");
            }
            }
        };

        const handleAccept = async () => { 
            if (microphoneResult!!.trim() !== '') {
                const newData = [...csvData, microphoneResult!!.trim()+','+intentName];
                console.log("Updated CSV", newData)
                await AsyncStorage.setItem('csvData', JSON.stringify(newData));
                setCsvData(newData);
                setFilteredData(newData.filter(line => line.endsWith(`,${intentName}`)));
                setMicrophoneResult('');
              }
         }

        const handleReject = () => { 
            setMicrophoneResult('');
         }

         const renderItem = ({ item }: { item: string }) => (
          <Text style={styles.listItem}>{item}</Text>
      );

    
  return (
    <View style={styles.container}>
    <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.headerText}>Past Entries:</Text>}
    />
    <Text style={styles.title}>{intentName}</Text>
    {microphoneResult ? <Text style={styles.result}>{microphoneResult}</Text> : null}
    {isListening ? (
        <Text style={styles.listeningText}>Listening...</Text>
    ) : null}
    {microphoneResult && !isListening ? (
        <View style={styles.buttonContainer}>
            <Button title='Confirm' onPress={handleAccept} />
            <Button title='Reject' onPress={handleReject} />
        </View>
    ) :         
    <Button title='Record' onPress={startSpeechRecognition} />}
</View>
  )
}

export default Record

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  listeningText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  listItem: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center',
  },
});