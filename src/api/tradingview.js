export const subscribeToSymbols = async (symbols) => {
    const response = await fetch('your-api-endpoint/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
    });
    return response.json();
};

export const getQuote = async (symbol) => {
    const response = await fetch(`your-api-endpoint/api/quotes/${symbol}`);
    return response.json();
};
