// Use React hooks
const { useState, useEffect, useRef } = React;

function ElectionResults() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    console.log("Component loaded");

    // Fetch available election years
    useEffect(() => {
        console.log("Fetching election years...");
        const fetchElectionYears = async () => {
            try {
                const response = await fetch('/api/election-results');
                console.log("Response status:", response.status);
                
                if (!response.ok) throw new Error('Failed to fetch election years');
                
                const data = await response.json();
                console.log("Fetched data:", data);
                
                setYears(data.map(item => item.year));
                if (data.length > 0) {
                    setSelectedYear(data[0].year);
                }
            } catch (err) {
                console.error("Error fetching election years:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchElectionYears();
    }, []);

    // Fetch election results when year changes
    useEffect(() => {
        if (!selectedYear) return;
        
        console.log("Fetching results for year:", selectedYear);
        const fetchElectionResult = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/election-results/${selectedYear}`);
                if (!response.ok) throw new Error('Failed to fetch election result');
                const data = await response.json();
                console.log("Fetched result data:", data);
                setResult(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching election result:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchElectionResult();
    }, [selectedYear]);

    // Effect to render chart using direct Chart.js
    useEffect(() => {
        if (chartRef.current && result) {
            console.log("Rendering chart with Chart.js");
            
            // Clear previous chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            
            try {
                // Get chart context
                const ctx = chartRef.current.getContext('2d');
                
                // Check if we're on mobile
                const isMobile = window.innerWidth <= 768;
                
                // Prepare chart data
                const data = {
                    labels: result.parties.map(party => party.name),
                    datasets: [{
                        data: result.parties.map(party => party.votes),
                        backgroundColor: result.parties.map(party => party.color),
                        borderWidth: 1
                    }]
                };
                
                // Create new chart with mobile-specific options
                chartInstance.current = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: isMobile ? 'bottom' : 'right',
                                labels: {
                                    boxWidth: isMobile ? 12 : 20,
                                    padding: isMobile ? 10 : 15,
                                    font: {
                                        size: isMobile ? 12 : 14,
                                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const percentage = ((context.raw / result.totalVotes) * 100).toFixed(1);
                                        return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            } catch (err) {
                console.error("Error creating chart:", err);
            }
        }
        
        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [result]);

    // Window resize handler for responsive chart
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current && chartInstance.current) {
                // Update chart options based on screen size
                const isMobile = window.innerWidth <= 768;
                chartInstance.current.options.plugins.legend.position = isMobile ? 'bottom' : 'right';
                chartInstance.current.options.plugins.legend.labels.boxWidth = isMobile ? 12 : 20;
                chartInstance.current.options.plugins.legend.labels.font.size = isMobile ? 12 : 14;
                chartInstance.current.update();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading election data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    if (!result || !selectedYear) {
        return <div className="no-results">No election results available</div>;
    }

    return (
        <div className="election-results-container">
            <div className="year-selector">
                <h2>Election Results Viewer</h2>
                <div className="select-wrapper">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        disabled={loading}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year} General Election</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="results-content">
                <div className="chart-wrapper">
                    <h3>{selectedYear} Election Results</h3>
                    <div className="chart-container">
                        <canvas ref={chartRef} height="400"></canvas>
                    </div>
                </div>

                <div className="results-table-wrapper">
                    <h3>Vote Breakdown</h3>
                    <div className="table-responsive">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Party</th>
                                    <th>Votes</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.parties.map(party => (
                                    <tr key={party.name}>
                                        <td style={{ color: party.color }}>
                                            <span className="party-color" style={{ backgroundColor: party.color }}></span>
                                            {party.name}
                                        </td>
                                        <td>{party.votes.toLocaleString()}</td>
                                        <td>{((party.votes / result.totalVotes) * 100).toFixed(1)}%</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td><strong>Total Votes</strong></td>
                                    <td><strong>{result.totalVotes.toLocaleString()}</strong></td>
                                    <td><strong>100%</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .election-results-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .year-selector {
        text-align: center;
        margin-bottom: 30px;
    }

    .year-selector h2 {
        color: #800000;
        margin-bottom: 15px;
    }

    .select-wrapper {
        display: inline-block;
        position: relative;
    }

    .select-wrapper:after {
        content: '▼';
        font-size: 12px;
        color: #800000;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    .year-selector select {
        padding: 10px 40px 10px 15px;
        font-size: 16px;
        border: 2px solid #800000;
        border-radius: 4px;
        background-color: white;
        appearance: none;
        cursor: pointer;
    }

    .results-content {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-top: 20px;
    }

    .chart-wrapper, .results-table-wrapper {
        flex: 1;
        min-width: 300px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .chart-wrapper h3, .results-table-wrapper h3 {
        color: #800000;
        margin-top: 0;
        margin-bottom: 20px;
        text-align: center;
    }

    .chart-container {
        height: 400px;
        position: relative;
    }
    
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .results-table {
        width: 100%;
        border-collapse: collapse;
    }

    .results-table th {
        background-color: #800000;
        color: white;
        padding: 12px;
        text-align: left;
    }

    .results-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
    }

    .party-color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .total-row {
        background-color: #f8f6f2;
    }

    .total-row td {
        font-weight: bold;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .loading-container {
        text-align: center;
        padding: 50px;
    }

    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid #800000;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }

    .error-message {
        text-align: center;
        padding: 30px;
        background: #ffebee;
        color: #d32f2f;
        border-radius: 8px;
        max-width: 600px;
        margin: 0 auto;
    }

    .error-message button {
        background: #800000;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        margin-top: 15px;
        cursor: pointer;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .election-results-container {
            padding: 10px;
        }
        
        .results-content {
            flex-direction: column;
        }
        
        .chart-wrapper, .results-table-wrapper {
            min-width: 100%;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .chart-container {
            height: 300px;
        }
        
        .results-table {
            font-size: 14px;
        }
        
        .results-table th, .results-table td {
            padding: 8px 5px;
        }
        
        .year-selector select {
            width: 100%;
            max-width: 300px;
            box-sizing: border-box;
        }
        
        .loading-container {
            padding: 30px;
        }
        
        .error-message {
            padding: 20px;
        }
    }
    
    /* Very small screens */
    @media (max-width: 480px) {
        .year-selector h2 {
            font-size: 1.5rem;
        }
        
        .chart-wrapper h3, .results-table-wrapper h3 {
            font-size: 1.2rem;
        }
        
        .results-table {
            font-size: 12px;
        }
        
        .party-color {
            width: 8px;
            height: 8px;
        }
    }
`;
document.head.appendChild(style);

// Handle React 18's createRoot API
const rootElement = document.getElementById('react-root');

if (rootElement) {
    console.log("Creating React 18 root");
    try {
        // For React 18
        if (ReactDOM.createRoot) {
            const root = ReactDOM.createRoot(rootElement);
            root.render(<ElectionResults />);
        } 
        // Fallback for React 17 and earlier
        else {
            console.log("Falling back to ReactDOM.render");
            ReactDOM.render(<ElectionResults />, rootElement);
        }
    } catch (error) {
        console.error("Error rendering:", error);
        rootElement.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #d32f2f;">
                <h3>Error Loading Election Results</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" 
                        style="background: #800000; color: white; border: none; padding: 10px 20px; 
                               border-radius: 4px; margin-top: 15px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
} else {
    console.error("Root element not found");
}