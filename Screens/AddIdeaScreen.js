import React, { useState, useEffect, useRef } from 'react';
import { TextInput,Pressable, StyleSheet, Text, View, SafeAreaView, Image,Dimensions,Modal,KeyboardAvoidingView, ScrollView } from 'react-native';
import { useGiftIdeas } from '../Context/GiftIdeasContext';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';

export default function AddIdeaScreen({route,navigation}){
    const { people } = useGiftIdeas();
    const [ideaName, setIdeaName] = useState('');
    const [picture, setPicture] = useState();
    const { personId } = route.params;
    const person = people.find(p => p.id === personId);
    const { addIdea} = useGiftIdeas(); 
    const [idea, setIdea] = useState('');
    const [ready, setReady] = useState(false);
    const camera = useRef(null); 
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null); 
  const aspectRatio = useRef(2 / 3); 
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = useRef(Math.floor(screenWidth * 0.6)); 
  const imageHeight = useRef(Math.floor(imageWidth.current * aspectRatio.current)); 
  const [modalVisible, setModalVisible] = useState(false);

  const takePic = async () => {
    if (camera.current) {
      const options = { quality: 0.8, exif: true };
      try {
        const photo = await camera.current.takePictureAsync(options);
        if (photo && photo.uri) {
          const savedPhoto = await savePicture(photo);
          setPicture(savedPhoto.uri);
        } else {
          console.log('No photo captured');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };
  

  const savePicture = async (photo) => {
    if (!photo.uri) {
      console.error('No URI in captured photo');
      return;
    }
    const newUri = FileSystem.documentDirectory + photo.uri.split('/').pop();
    try {
      await FileSystem.moveAsync({
        from: photo.uri,
        to: newUri,
      });
      return { uri: newUri, width: imageWidth.current, height: imageHeight.current };
    } catch (error) {
      console.error('Error saving picture:', error);
      return; 
    }
  };
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>;
      </View>
    );
  }

  const saveIdea = () => {
    if (!ideaName || !picture){
      setModalVisible(true);
      return;
    } 
    const newIdea = {
      id: Math.random().toString(),
      name: ideaName,
      picture: picture,
      width: imageWidth.current, 
      height: imageHeight.current 
    }; 
    addIdea(personId, newIdea);
    navigation.goBack();
  };


    const cancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Please enter both a gift idea and a picture before saving.</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Ok</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        <KeyboardAvoidingView 
                behavior="padding" 
                style={styles.container}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
            <Text style={styles.headerText}>Add idea for {person?.name}</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.inputLabel}>Gift Idea</Text>
                <TextInput
                    style={styles.input}
                    value={ideaName}
                    onChangeText={setIdeaName}
                    placeholder="Enter name"
                />
         <View style={styles.CameraContainer}>
         {picture ? (
          <Image
            source={{ uri: picture}}
            style={[styles.camera, {width: imageWidth.current, height: imageHeight.current}]}
          />
        ) : (
          <Camera
            style={styles.camera}
            type={type}
            ref={camera}
          >
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >

          </Pressable>
        <Pressable onPress={takePic} style={styles.buttonTake}>
        <Icon name="camera" size={30} color="#000" />
        </Pressable>

        </View>
      </Camera> )}
        </View>       
        <Pressable style={styles.save} onPress={saveIdea}>
        <Text style={styles.buttonText}>Save</Text>
        </Pressable>
        <Pressable style={styles.cancel} onPress={cancel}>
        <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
            </View>
              </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: -70,
    },
    CameraContainer: {
    
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 20,
    },
    form: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    save: {
        backgroundColor: 'lightblue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 10, 
    },
    cancel: {
        backgroundColor: '#EE4B2B',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
  camera: {
    width: 300,
    height: 400,
    margin: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center', 
    alignItems: 'flex-end', 
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  buttonTake: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
},
modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
},
button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
},
buttonClose: {
    backgroundColor: "#2196F3",
},
textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
},
modalText: {
    marginBottom: 15,
    textAlign: "center"
}
});