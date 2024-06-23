export const generateImageComponent = (text: string) => {
    return (
        <div
            style={{
                alignItems: 'center',
                background: 'linear-gradient(to right, #432889, #17101F)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <div
                style={{
                    color: 'white',
                    fontSize: 60,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.4,
                    marginTop: 30,
                    padding: '0 120px',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {text}
            </div>
        </div>
    );
};

export const abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "type": "function"
    }
];