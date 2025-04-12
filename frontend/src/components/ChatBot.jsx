import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Typography,
    CircularProgress,
    Fade,
    useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import api from '../services/api';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const theme = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            const response = await api.sendChatMessage(userMessage);
            setMessages(prev => [...prev, { text: response.reply, sender: 'bot' }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                error: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <SmartToyIcon color="primary" />
                <Typography variant="h6">Stock Assistant</Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            gap: 1
                        }}
                    >
                        {message.sender === 'bot' && (
                            <SmartToyIcon
                                sx={{
                                    color: message.error ? 'error.main' : 'primary.main',
                                    alignSelf: 'flex-start',
                                    mt: 1
                                }}
                            />
                        )}
                        <Paper
                            elevation={1}
                            sx={{
                                p: 1.5,
                                maxWidth: '70%',
                                bgcolor: message.sender === 'user' 
                                    ? 'primary.main' 
                                    : message.error 
                                        ? 'error.dark'
                                        : 'background.paper',
                                color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="body2">{message.text}</Typography>
                        </Paper>
                        {message.sender === 'user' && (
                            <PersonIcon
                                sx={{
                                    color: 'primary.main',
                                    alignSelf: 'flex-start',
                                    mt: 1
                                }}
                            />
                        )}
                    </Box>
                ))}
                {loading && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <SmartToyIcon color="primary" />
                        <Fade in={loading}>
                            <CircularProgress size={20} />
                        </Fade>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Ask about stocks..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                color="primary"
                            >
                                <SendIcon />
                            </IconButton>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ChatBot; 