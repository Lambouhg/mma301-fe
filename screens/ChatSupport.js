import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, Appbar } from 'react-native-paper';

const ChatSupport = () => {
    const [messages, setMessages] = useState([]);

    const predefinedQuestions = [
        "What types of shoes do you have?",
        "Do you have running shoes?",
        "What is the price range?",
        "Can you suggest a shoe for running?",
        "How do I choose the right size?",
        "Do you have discounts available?",
        "What are your return policies?",
    ];

    const predefinedResponses = {
        "what types of shoes do you have?": "We have a wide range of shoes, including sneakers, boots, and sandals. What type are you interested in?",
        "do you have running shoes?": "Yes, we have a variety of running shoes. Would you like recommendations?",
        "what is the price range?": "Our shoe prices range from $30 to $200 depending on the style. Are you looking for something specific?",
        "can you suggest a shoe for running?": "I recommend our latest running shoes, which provide great support and comfort.",
        "how do I choose the right size?": "You can refer to our size guide on the website for accurate measurements.",
        "do you have discounts available?": "Yes, we often have promotions and discounts. Please check our website for current offers.",
        "what are your return policies?": "You can return any unworn shoes within 30 days for a full refund.",
    };

    const handleSelectQuestion = (question) => {
        const userMessage = { id: Date.now().toString(), text: question, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        const responseText = predefinedResponses[question.toLowerCase()] || "I'm sorry, I don't understand your question.";
        const responseMessage = { id: Date.now() + 1, text: responseText, sender: 'support' };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
    };

    const renderMessage = ({ item }) => (
        <Card style={[styles.messageCard, item.sender === 'user' ? styles.userMessage : styles.supportMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </Card>
    );

    const renderQuestion = ({ item }) => (
        <Button
            mode="outlined"
            onPress={() => handleSelectQuestion(item)}
            style={styles.questionButton}
            labelStyle={styles.questionButtonText}
            contentStyle={styles.questionButtonContent}
        >
            {item}
        </Button>
    );

    return (
        <View style={styles.container}>
           
            <ScrollView style={styles.messagesContainer}>
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.messagesContentContainer}
                />
            </ScrollView>
            <View style={styles.questionsContainer}>
                <FlatList
                    data={predefinedQuestions}
                    renderItem={renderQuestion}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalQuestions}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messagesContentContainer: {
        paddingBottom: 10,
    },
    messageCard: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: '70%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
    },
    supportMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#333333', // Match the question button color
    },
    messageText: {
        color: '#fff',
    },
    questionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    horizontalQuestions: {
        paddingVertical: 10,
    },
    questionButton: {
        marginRight: 10,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        minWidth: 150,
    },
    questionButtonText: {
        color: '#007bff',
        fontSize: 14,
    },
    questionButtonContent: {
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
});

export default ChatSupport;
