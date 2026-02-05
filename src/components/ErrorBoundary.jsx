import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    padding: '2rem',
                    fontFamily: 'system-ui, sans-serif',
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: '#FEF2F2',
                    border: '2px solid #EF4444',
                    borderRadius: '12px',
                    color: '#1F2937',
                    marginTop: '40px'
                }}>
                    <h1 style={{ color: '#DC2626', fontSize: '24px', marginBottom: '16px' }}>Algo deu errado (Tela Branca)</h1>
                    <p style={{ marginBottom: '16px' }}>Ocorreu um erro inesperado na aplicação. Abaixo estão os detalhes técnicos:</p>

                    <details style={{
                        whiteSpace: 'pre-wrap',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #FECACA',
                        marginBottom: '20px',
                        maxHeight: '300px',
                        overflow: 'auto',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                    }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Ver detalhes do erro</summary>
                        <br />
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#DC2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            RESETAR DADOS (Apagar Tudo)
                        </button>
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
                        * O botão "Resetar Dados" apagará suas listas salvas e configurações locais. Use se o erro persistir.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
