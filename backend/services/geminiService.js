const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to read and format stock data
const loadStockData = async (sector) => {
    const stocksPath = path.join(__dirname, '../../stocks');
    const sectorPath = path.join(stocksPath, sector);
    
    try {
        const files = fs.readdirSync(sectorPath);
        const stocksData = {};
        
        for (const file of files) {
            if (file.endsWith('.csv')) {
                const content = fs.readFileSync(path.join(sectorPath, file), 'utf-8');
                const stockName = file.replace('.csv', '');
                stocksData[stockName] = content;
            }
        }
        return stocksData;
    } catch (error) {
        console.error(`Error loading stock data for sector ${sector}:`, error);
        return null;
    }
};

// Function to get all available sectors
const getSectors = () => {
    const stocksPath = path.join(__dirname, '../../stocks');
    return fs.readdirSync(stocksPath).filter(file => 
        fs.statSync(path.join(stocksPath, file)).isDirectory()
    );
};

const generateStockAnalysis = async (query, sector = null) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create context from stock data
        let context = '';
        if (sector) {
            const sectorData = await loadStockData(sector);
            if (sectorData) {
                context += `Analyzing ${sector} sector stocks:\n`;
                Object.entries(sectorData).forEach(([stock, data]) => {
                    // Add first few lines of data as context
                    const lines = data.split('\n').slice(0, 5).join('\n');
                    context += `${stock} data:\n${lines}\n\n`;
                });
            }
        } else {
            // Get overview of all sectors
            const sectors = getSectors();
            context += `Available sectors for analysis: ${sectors.join(', ')}\n`;
        }

        // Prepare prompt with context and query
        const prompt = `
        As a stock market analysis assistant, analyze the following data and answer the query.
        
        Context:
        ${context}
        
        User Query: ${query}
        
        Please provide a detailed analysis considering:
        1. Market trends
        2. Sector performance
        3. Individual stock metrics
        4. Potential risks and opportunities
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error generating stock analysis:', error);
        return 'Sorry, I encountered an error analyzing the stocks. Please try again.';
    }
};

const generateSectorComparison = async (sectors) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        let context = '';

        // Load data for each sector
        for (const sector of sectors) {
            const sectorData = await loadStockData(sector);
            if (sectorData) {
                context += `${sector} sector overview:\n`;
                Object.entries(sectorData).forEach(([stock, data]) => {
                    const lines = data.split('\n').slice(0, 3).join('\n');
                    context += `${stock}:\n${lines}\n\n`;
                });
            }
        }

        const prompt = `
        As a sector analysis expert, compare the following sectors:
        
        ${context}
        
        Please provide:
        1. Sector-wise performance comparison
        2. Key trends in each sector
        3. Investment opportunities
        4. Risk assessment
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error generating sector comparison:', error);
        return 'Sorry, I encountered an error comparing sectors. Please try again.';
    }
};

module.exports = {
    generateStockAnalysis,
    generateSectorComparison,
    getSectors
}; 