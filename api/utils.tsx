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
                    fontSize: 30,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.4,
                    marginTop: 30,
                    marginLeft: 200,
                    marginRight: 200,
                    padding: '0 120px',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {text}
            </div>
        </div>
    );
};