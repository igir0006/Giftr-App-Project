import React, { useState, useContext } from 'react';
import { TextInput,Pressable, StyleSheet, Text, View, SafeAreaView,Modal,KeyboardAvoidingView, ScrollView} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { useGiftIdeas } from '../Context/GiftIdeasContext';

export default function AddPersonScreen({navigation}) {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ideas, setIdeas] = useState([]);
    const { addPerson } = useGiftIdeas(); 
    const [modalVisible, setModalVisible] = useState(false);


    const savePerson = () => {
        if (!name || !dateOfBirth) {
            setModalVisible(true);
            return; 
        }
        
        const newPerson = { id: Math.random().toString(), name, birthday: dateOfBirth, ideas };
        addPerson(newPerson);
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
                    <Text style={styles.modalText}>Please enter both a name and a date of birth before saving.</Text>
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
                <Text style={styles.headerText}>Add a Person</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.inputLabel}>Person's Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                />
                <Text style={styles.inputLabel}>Date of Birth:</Text>
                <DatePicker
                    options={{
                        backgroundColor: '#fff',
                        textHeaderColor: '#000',
                        labelColor: '#000',
                        color: '#000',
                    }}
                    onSelectedChange={setDateOfBirth}
                    current={dateOfBirth}
                    mode="calendar"
                />
                <Pressable style={styles.save} onPress={savePerson}>
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
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
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
