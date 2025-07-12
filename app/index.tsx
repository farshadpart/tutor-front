import { Chat, chat } from '@/services/chatGptService';
import React, { useRef, useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  reply: boolean,
  error?: boolean
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [input, setInput] = useState('');
  const [chatbotIsTyping, setChatbotIsTyping] = useState(false);

  const sendMessage = async () => {
    const userInput = input.trim();
    setMessages([...messages, { id: Date.now().toString(), text: input ?? '', reply: false }]);
    setInput('');
    setChatbotIsTyping(true);
    const chats: Chat[] = [{ role: 'system', content: 'You are an English tutor. The student is using a voice keyboard, so punctuation may be missing or incorrect. Ignore all punctuation issues completely. Focus only on correcting grammar, word choice, and sentence structure. After correcting, continue the conversation naturally.' }];
    if (input.trim()) {
      messages.forEach(msg => {
        chats.push({ role: msg.reply ? 'assistant' : 'user', content: msg.text });
      });
      chats.push({ role: 'user', content: userInput });

      try {
        const response = await chat(chats);
        const chatBotReply = response.choices[0].message.content;
        setMessages(prev => [...prev, { id: Date.now().toString() + '-reply', text: chatBotReply ?? '', reply: true }]);
      } catch {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-reply', text: 'It seems the tutor is busy! Please try again.', reply: true, error: true }]);
      }

      setInput('');
      setChatbotIsTyping(false);
    }
  };

  const flatListRef = useRef<FlatList>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <View style={[
            styles.message,
            item.reply ? (!item.error ? styles.replyMessage : styles.errorMessage) : styles.receivedMessage
          ]}><Text>{item.text}</Text></View>}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          onContentSizeChange={(width, height) => {
            flatListRef.current?.scrollToOffset({ offset: height, animated: true });
          }}
          ListFooterComponent={
            chatbotIsTyping ? (
              <View style={styles.typingIndicator}>
                <Text>Assistant is typing...</Text>
              </View>
            ) : <View style={{ height: 10 }} /> // always keep small buffer
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
          />
          <Button disabled={chatbotIsTyping} title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  replyMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // WhatsApp-style green
  },
  errorMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffcccc', // WhatsApp-style red
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  typingIndicator: {
    padding: 10,
    alignItems: 'center',
  },
});

