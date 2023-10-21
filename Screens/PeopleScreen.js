import React, { useCallback } from 'react';
import { Alert, View,Pressable, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import { useGiftIdeas } from '../Context/GiftIdeasContext';

export default function PeopleScreen() {
    const { people, removePerson } = useGiftIdeas();
    const navigation = useNavigation();

    const handleDelete = useCallback((id) => {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete this person?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => removePerson(id) }
            ],
            { cancelable: false }
        );
    }, [removePerson]);

    const renderRightActions = (id) => (
        <Pressable
            style={styles.deleteAction}
            onPress={() => handleDelete(id)}
        >
            <Icon name="trash" size={30} color="#FFF" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>People List</Text>
            </View>
            {people.length === 0 ? (
                <View style={styles.emptyMessageContainer}>
                    <Text style={styles.emptyMessageText}>No people added yet. Please add the first person.</Text>
                </View>
            ) : (
                <FlatList
                    data={people}
                    renderItem={({ item }) => (
                        <Swipeable
                            friction={2}
                            rightThreshold={40}
                            renderRightActions={() => renderRightActions(item.id)}
                        >
                            <View style={styles.item}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                    <Text style={styles.dateText}>{item.birthday}</Text>
                                </View>
                                <Pressable
                                    style={styles.ideaIcon}
                                    onPress={() => navigation.navigate('Ideas', { personId: item.id })}
                                >
                                    <Icon name="lightbulb-o" size={40} color="#000" />
                                </Pressable>
                            </View>
                        </Swipeable>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 0,
    },
    header: {
        padding: 20,
        backgroundColor: 'white', 
    },
    headerText: {
        fontSize: 20,
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'lightgrey', 
    },
    nameContainer: {
        alignItems: 'flex-start',
    },
    emptyMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyMessageText: {
        fontSize: 18,
        color: 'grey', 
        textAlign: 'center',
    },
    deleteAction: {
        backgroundColor: '#EE4B2B',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: '100%',
    },
    ideaIcon: {
        padding: 20,
    },
});

