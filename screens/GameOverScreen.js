import React from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    Button, 
    Image, 
    Dimensions, 
    ScrollView
    } from 'react-native';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import Colors from '../constants/colors';
import MainButton from '../components/MainButton';

const GameOverScreen = props => {
    return (
        <ScrollView>
            <View style={styles.screen}>
                <TitleText>The Game is Over!</TitleText>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} resizeMode= "cover" source={require('../assets/success.png')} />
                    {/* <Image 
                    fadeDuration={300}
                    style={styles.image} 
                    resizeMode= "cover" 
                    source={{uri: 'https://media.istockphoto.com/photos/ama-dablam-mount-in-the-nepal-himalaya-picture-id485966046?k=6&m=485966046&s=612x612&w=0&h=rpI0-lFzV1XwBNwV5stQy_cDeICYTN8xGn_O0dOlync='}} /> */}
                </View>

                <View style={styles.resultContainer}>
                    <BodyText style={styles.resultText}>Your phone needed <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to guess the number <Text style={styles.highlight}>{props.userNumber}</Text> </BodyText>
                </View>

                <MainButton onPress={props.onRestart}> Start new game</MainButton>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    imageContainer:{
        borderWidth: 3,
        borderColor: 'black',
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        borderRadius:  Dimensions.get('window').width * 0.7 / 2,
        overflow: 'hidden',
        marginVertical: Dimensions.get('window').height / 20
    },
    image: {
        width:'100%',
        height:'100%',
    },
    highlight:{
        color: Colors.primary,
        fontFamily: 'open-sans-bold'
    },
    resultText:{
        textAlign:'center',
        fontSize: Dimensions.get('window').height < 400 ? 14 : 17
    },
    resultContainer: {
        width:'80%',
        marginHorizontal: 30,
        marginVertical: Dimensions.get('window').height / 60,
    }
})

export default GameOverScreen