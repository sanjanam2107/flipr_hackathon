import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const StockChart = ({ data, symbol }) => {
    // Parse the historical data string into an array of objects
    const chartData = JSON.parse(data).map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        price: parseFloat(item.price)
    }));

    return (
        <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
                {symbol} Price History
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default StockChart; 