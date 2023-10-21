import React, { useState,useCallback } from 'react';
import { View, FlatList,Alert, Text, SafeAreaView, Pressable, StyleSheet, Image, Modal} from 'react-native';
import { useGiftIdeas } from '../Context/GiftIdeasContext';

export default function IdeaScreen({ route }) {
    const { people, removeIdea } = useGiftIdeas();
    const { personId } = route.params;
    const person = people.find(p => p.id === personId);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
  
    const handleImagePress = (imageUri) => {
      setSelectedImage(imageUri);
      setModalVisible(true);
    };

    const handleDelete = useCallback((ideaId) => {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete this idea?',
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        removeIdea(personId, ideaId);
                    }
                }
            ],
            { cancelable: false }
        );
    }, [removeIdea, personId]);

    const renderIdea = ({ item }) => {
        const thumbnailHeight = item.width ? (styles.photo.width * item.height) / item.width : styles.photo.height;
    
        return (
            <View style={styles.ideaBox}>
                {item.picture && (
                    <Pressable onPress={() => handleImagePress(item.picture)}>
                    <Image source={{ uri: item.picture }} style={[styles.photo, { height: thumbnailHeight } ]} />
                    </Pressable>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Pressable onPress={() => handleDelete(item.id)} style={styles.delete}>
                    <Text style={styles.buttonText}>Delete Idea</Text>
                    </Pressable>
                </View>
            </View>
        );
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
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text style={styles.header}>Ideas for {person?.name}</Text>
            {person?.ideas && person?.ideas.length === 0 ? ( 
                <View style={styles.noIdeasBox}> 
                    <Text style={styles.noIdeasText}>No ideas for {person?.name} yet</Text>
                </View>
            ) : (
                <FlatList
                    data={person?.ideas}
                    renderItem={renderIdea}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        fontSize: 20,
    },
    ideaBox: {
        flexDirection: 'row',
        backgroundColor: 'lightgrey', 
        margin:10,
        overflow: 'hidden', 
        alignItems: 'center',
        borderWidth: 1.3,
        borderColor: 'black'
    },
    photo: {
        width: 100,
        height: undefined, 
        margin:10,
        aspectRatio: 1, 
    },
    textContainer: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        margin:30,
        alignItems: 'flex-start', 
    },
    title: {
        fontSize: 18,
        fontWeight:'bold',
    },
    delete: {
        backgroundColor: '#EE4B2B',
        padding: 15,
        marginTop: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    noIdeasBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        backgroundColor: 'lightgrey',
    },
    noIdeasText: {
        fontSize: 18,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)', 
      },
      modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        maxWidth: '90%',
        maxHeight: '90%',
    },
    modalImage: {
        width: '100%',
        aspectRatio: 1, 
        flex: 1, 
    },
      closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        marginTop:120,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },

});



