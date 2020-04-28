import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import Constants from "expo-constants";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import Card from '../components/Card'
import Colors from '../constants/colors'
import Input from '../components/Input'
import BodyText from '../components/BodyText';

const StartGameScreen = props => {

    const [enteredValue, setEnteredValue] = useState('')
    const [generated, setGenerated] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [buttonWidth, setButtonWidth] = useState(Dimensions.get('window').width / 3.5)
    const [qrUrl, setQrUrl] = useState('')

    const inputHandler = inputText => {
        setEnteredValue(inputText)
    }

    const resetInputHandler = () => {
        setEnteredValue('');
        setGenerated(false)
    }

    // using useEffect cleans up the event listener once the screen has been re-rendered
    // this way only one event listener works at every point... ie: the code runs only once and stops listening till the app is re-rendered
    useEffect(() => {
        const updateLayout = () => {
            setButtonWidth(Dimensions.get('window').width / 3.5)
        }
        Dimensions.addEventListener('change', updateLayout)
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        }
    });

    const { manifest } = Constants;
    const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000/v1/api/`;

    const sendRequest = async () => {
        setProcessing(true)
        return fetch(uri + 'qr/generate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { qrCodeData: enteredValue }
            ),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                setQrUrl(responseJson.data.qrCodeUrl)
                setProcessing(false)
                setGenerated(true)
                // setEnteredValue('');
                Keyboard.dismiss()
            })
            .catch((error) => {
                console.error(error);
            });
        // }

    }

    const donwloadFile = async () => {
        const fileUri = FileSystem.documentDirectory + 'qrcode.png';
        const url = qrUrl;

        let downloadObject = FileSystem.createDownloadResumable(
            url,
            fileUri
        );
        let response = await downloadObject.downloadAsync();
        openShareDialogAsync(response.uri)
    }

    let openShareDialogAsync = async (uri) => {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }

        Sharing.shareAsync(uri);
    };

    let qrCode;
    if (generated && !processing) {
        qrCode = (
            <View>
                <View style={styles.imageContainer}>
                    <Image
                        fadeDuration={300}
                        style={styles.image}
                        resizeMode="cover"
                        source={{ uri: qrUrl }}
                    />
                </View>
                <Button title="Share QR Code" onPress={donwloadFile} />
            </View>
        )
    }

    if (processing) {
        qrCode = (
            <View>
                <Text>Generating QR Code...</Text>
            </View>
        )
    }
    return (
        <ScrollView>
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <View style={styles.screen}>
                        <Text style={styles.title}>Generate a new QR Code</Text>
                        <Card style={styles.inputContainer}>
                            <BodyText>Input a url to embed in the QR Code</BodyText>
                            <Input
                                style={styles.input}
                                blurOnSubmit
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType="default"
                                // maxLength={2} 
                                onChangeText={inputHandler}
                                value={enteredValue}
                            />
                            <View style={styles.buttonContainer}>
                                <View style={{ width: buttonWidth }}>
                                    <Button style={styles.button} title="Reset" onPress={resetInputHandler} color={Colors.accent} />
                                </View>
                                <View style={{ width: buttonWidth }}>
                                    <Button title="Confirm" onPress={sendRequest} color={Colors.primary} />
                                </View>
                            </View>
                            {qrCode}
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        fontFamily: 'open-sans-bold'
    },
    inputContainer: {
        width: '80%',
        minWidth: 300,
        maxWidth: '95%',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-between",
        paddingHorizontal: 15
    },

    imageContainer: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        overflow: 'hidden',
        marginVertical: Dimensions.get('window').height / 20
    },
    image: {
        width: '100%',
        height: '100%',
    },
    input: {
        width: "100%",
        textAlign: 'center',
        marginBottom: 15
    },
    summaryContainer: {
        marginTop: 20,
        alignItems: 'center'
    }
})

export default StartGameScreen;