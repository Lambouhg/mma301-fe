import React, { useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Card, Appbar } from "react-native-paper";

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);

  const predefinedQuestions = [
    "Bạn có những loại giày nào?",
    "Bạn có giày chạy bộ không?",
    "Mức giá dao động là bao nhiêu?",
    "Bạn có thể gợi ý một đôi giày để chạy bộ không?",
    "Làm thế nào để tôi chọn đúng kích cỡ?",
    "Bạn có chương trình giảm giá nào không?",
    "Chính sách đổi trả của bạn là gì?",
  ];

  const predefinedResponses = {
    "Bạn có những loại giày nào?":
      "Chúng tôi có nhiều loại giày, bao gồm giày thể thao, giày bốt, và dép. Bạn quan tâm đến loại nào?",
    "Bạn có giày chạy bộ không?":
      "Vâng, chúng tôi có nhiều loại giày chạy bộ. Bạn có muốn nhận gợi ý không?",
    "Mức giá dao động là bao nhiêu?":
      "Giá giày của chúng tôi dao động từ 30 đến 200 đô la tùy theo kiểu dáng. Bạn đang tìm kiếm mẫu cụ thể nào không?",
    "Bạn có thể gợi ý một đôi giày để chạy bộ không?":
      "Tôi khuyên bạn nên thử đôi giày chạy bộ mới nhất của chúng tôi, mang lại sự hỗ trợ và thoải mái tuyệt vời.",
    "Làm thế nào để tôi chọn đúng kích cỡ?":
      "Bạn có thể tham khảo bảng kích cỡ trên trang web của chúng tôi để có số đo chính xác.",
    "Bạn có chương trình giảm giá nào không?":
      "Vâng, chúng tôi thường có các chương trình khuyến mãi và giảm giá. Vui lòng kiểm tra trên trang web để biết ưu đãi hiện tại.",
    "Chính sách đổi trả của bạn là gì?":
      "Bạn có thể đổi trả giày chưa sử dụng trong vòng 30 ngày để được hoàn tiền đầy đủ.",
  };

  const handleSelectQuestion = (question) => {
    const userMessage = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const responseText =
      predefinedResponses[question] ||
      "I'm sorry, I don't understand your question.";
    const responseMessage = {
      id: Date.now() + 1,
      text: responseText,
      sender: "support",
    };
    setMessages((prevMessages) => [...prevMessages, responseMessage]);
  };

  const renderMessage = ({ item }) => (
    <Card
      style={[
        styles.messageCard,
        item.sender === "user" ? styles.userMessage : styles.supportMessage,
      ]}
    >
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
    backgroundColor: "#f8f8f8",
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
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  supportMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333333", // Match the question button color
  },
  messageText: {
    color: "#fff",
  },
  questionsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#007bff",
    fontSize: 14,
  },
  questionButtonContent: {
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
});

export default ChatSupport;
