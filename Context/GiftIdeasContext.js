import React, { createContext, useContext, useState } from 'react';

const GiftIdeasContext = createContext();

export const GiftIdeasProvider = ({ children }) => {
    const [people, setPeople] = useState([]); 

    const addPerson = (person) => {
        setPeople(prevPeople => [...prevPeople, { ...person, ideas: [] }]);
    };

    const removePerson = (id) => {
        setPeople(prevPeople => prevPeople.filter(person => person.id !== id));
    };

    const addIdea = (personId, idea) => {
        setPeople(prevPeople =>
            prevPeople.map(person =>
                person.id === personId
                    ? { ...person, ideas: [...person.ideas, idea] }
                    : person
            )
        );
    };

    const removeIdea = (personId, ideaId) => {
        setPeople(prevPeople =>
            prevPeople.map(person =>
                person.id === personId
                    ? {
                        ...person,
                        ideas: person.ideas.filter(idea => idea.id !== ideaId),
                      }
                    : person
            )
        );
    };

    return (
        <GiftIdeasContext.Provider value={{ people, addPerson, removePerson, addIdea, removeIdea }}>
            {children}
        </GiftIdeasContext.Provider>
    );
};

export const useGiftIdeas = () => {
    const context = useContext(GiftIdeasContext);
    if (!context) throw new Error('useGiftIdeas must be used within a GiftIdeasProvider');
    return context;
};
