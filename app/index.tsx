import { VoiceRecorder } from '@/components/recorder/VoiceRecorder';
import { Chat, chat, transcription } from '@/services/chatGptService';
import { makeChatReady } from '@/services/chatService';
import { getChatHistory, Message, saveChatHistory } from '@/services/messageService';
import React, { useEffect, useRef, useState } from 'react';
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

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [input, setInput] = useState('');
  const [chatbotIsTyping, setChatbotIsTyping] = useState(false);
  const [anlysing, setAnalysing] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const history = await getChatHistory();
      setMessages(history);
    };

    fetchChatHistory();
  }, []);

  const sendVoiceMessage = async (audio: { uri: string; name: string; type: string }) => {
    setAnalysing(true);
    let userTranscription = await transcription({ url: audio.uri });
    setAnalysing(false);
    await sendTextMessage(userTranscription);
  };

  const sendTextMessage = async (userTranscription?: string) => {
    const userInput = userTranscription ?? input.trim();
    setMessages([...messages, { id: Date.now().toString(), text: userInput ?? '', reply: false }]);
    setInput('');
    setChatbotIsTyping(true);
    const chats: Chat[] = [];
    if (userInput.trim()) {
      messages.forEach(msg => {
        chats.push({ role: msg.reply ? 'assistant' : 'user', content: msg.text });
      });

      try {
        const response = await chat(makeChatReady(chats, userInput));
        const chatBotReply = response.choices[0].message.content;
        setMessages(prev => {
          let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: chatBotReply ?? '', reply: true }]
          const save = async () => await saveChatHistory(latestMessages);
          save();
          return latestMessages;
        });
      } catch {
        setMessages(prev => {
          let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'It seems the tutor is busy! Please try again.', reply: true, error: true }]
          const save = async () => await saveChatHistory(latestMessages);
          save();
          return latestMessages;
        });
      }

      setInput('');
      setChatbotIsTyping(false);
    }
  };

  const renderFooter = () => {
    if (chatbotIsTyping) {
      return (
        <View style={styles.typingIndicator}>
          <Text>Assistant is typing...</Text>
        </View>
      );
    }

    if (anlysing) {
      return (
        <View style={styles.typingIndicator}>
          <Text>Analysing your voice...</Text>
        </View>
      );
    }

    return (
      <View style={styles.mic}>
        <VoiceRecorder onRecordingComplete={(audio) => sendVoiceMessage(audio)} />
      </View>
    );
  }

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
          ListFooterComponent={renderFooter()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
          />
          <Button disabled={chatbotIsTyping} title="Send" onPress={() => sendTextMessage()} />
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
  mic: {
    alignItems: 'center',
  },
});

