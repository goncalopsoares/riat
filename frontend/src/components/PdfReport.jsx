import React, { useRef, useState } from 'react';
import { pdf, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import Chart from "react-apexcharts";
import html2canvas from 'html2canvas';

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 20 },
    chartImage: { width: 500, height: 300 },
});

const ReportDocument = ({
    creationTime,
    projectName,
    projectOrganization,
    chartImage,
    dimensionsData,
    score,
    maxScore,
    recommendationLevel,
    recommendation,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Report</Text>
                <Text>{creationTime}</Text>
                <Text>{projectName}</Text>
                <Text>{projectOrganization}</Text>
            </View>

            <View style={styles.section}>
                <Text>Radar Chart:</Text>
                {chartImage && <Image style={styles.chartImage} src={chartImage} />}
            </View>

            <View style={styles.section}>
                {dimensionsData.map(dimension => (
                    <View key={dimension.id} className="mb-4">
                        <Text>{dimension.name}</Text>
                        <Text>{dimension.description}</Text>

                        {dimension.statements.map(statement => (
                            <View key={statement.id} className="ml-4 mb-2">
                                <Text>{statement.name}</Text>
                                <Text>{statement.description}</Text>

                                {statement.answers.map(answer => (
                                    <View key={answer.id} className="ml-4 text-sm text-gray-600">
                                        <Text>Answer: {answer.value}</Text><br />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text>Score: {score} / {maxScore}</Text>
                <Text>Overall Responsibility Level</Text>
                <Text>{recommendationLevel}</Text>
                <Text>The overall responsibility level is calculated based on the average score from the dimensions of the framework. The levels are based on the average score.</Text>
                <Text>{recommendation}</Text>
            </View>
        </Page>
    </Document>
);

const DownloadPDFButton = ({ series, options, ...props }) => {
    const chartRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);

        const chartCanvas = chartRef.current;
        const canvas = await html2canvas(chartCanvas);
        const chartImage = canvas.toDataURL('image/png');

        const blob = await pdf(
            <ReportDocument chartImage={chartImage} {...props} />
        ).toBlob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'relatorio.pdf';
        link.click();

        setLoading(false);
    };

    return (
        <>
            {/* Hidden chart renderer */}
            <div ref={chartRef} style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                <Chart options={options} series={series} type="radar" width="500" height="300" />
            </div>

            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Generating PDF...' : 'Save Report as PDF'}
            </button>
        </>
    );
};


export default DownloadPDFButton;