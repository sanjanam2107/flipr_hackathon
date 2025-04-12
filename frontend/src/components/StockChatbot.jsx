import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Chip,
    Stack,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';

const Message = ({ text, isBot, isLoading }) => {
    const theme = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexDirection: isBot ? 'row' : 'row-reverse'
                }}
            >
                <Chip
                    icon={isBot ? <SmartToyIcon /> : <PersonIcon />}
                    label={isBot ? 'StockBot' : 'You'}
                    color={isBot ? 'primary' : 'secondary'}
                    sx={{ height: 32 }}
                />
                <Paper
                    sx={{
                        p: 2,
                        maxWidth: '80%',
                        backgroundColor: isBot 
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.secondary.main, 0.1),
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography>Analyzing stocks...</Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}
                        >
                            {text}
                        </Typography>
                    )}
                </Paper>
            </Box>
        </motion.div>
    );
};

const StockChatbot = () => {
    const [messages, setMessages] = useState([
        { 
            text: "Hi! I'm your AI stock analysis assistant. I can help you analyze stocks, compare sectors, and provide market insights. What would you like to know?",
            isBot: true 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            const data = await response.json();
            
            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                text: "Sorry, I encountered an error. Please try again.", 
                isBot: true 
            }]);
        } finally {
            setIsLoading(false);
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
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: alpha('#000000', 0.6),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon color="primary" />
                    Stock Analysis Assistant
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            text={message.text}
                            isBot={message.isBot}
                        />
                    ))}
                    {isLoading && (
                        <Message
                            text=""
                            isBot={true}
                            isLoading={true}
                        />
                    )}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </Box>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about stocks, sectors, or market trends..."
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: alpha('#000000', 0.3),
                        }
                    }}
                />
                <IconButton 
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        }
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default StockChatbot; 