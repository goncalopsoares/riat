import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';
import Chart from "react-apexcharts";

const Report = () => {

    const [reportData, setReportData] = useState(null);
    const [chartCategories, setChartCategories] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [recommendationLevel, setRecommendationLevel] = useState(0);
    const [recommendation, setRecommendation] = useState("");

    const { id } = useParams();

    useEffect(() => {
        const getReport = async () => {
            const response = await api.get(`api/report/${id}/`);
            setReportData(response.data);
        }
        getReport();

    }, [id]);

    //CHART DATA

    const getChartCategories = () => {
        if (reportData) {
            const categories = reportData[0]?.dimension_scores_output.map(item => item.dimension_name);
            setChartCategories(categories);
            return categories;
        }
    }

    const getChartData = () => {
        if (reportData) {
            const data = reportData[0]?.dimension_scores_output.map(item => item.reports_score_dimension_score);
            setChartData(data);
            return data;
        }
    }

    useEffect(() => {
        getChartCategories();
        getChartData();
    }, [reportData]);

    const [options, setOptions] = useState({
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: []
        }
    });

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: {
                ...prevOptions.xaxis,
                categories: chartCategories
            }
        }));
    }, [chartCategories]);

    const [series, setSeries] = useState([
        {
            name: "series-1",
            data: []
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                name: "series-1",
                data: chartData
            }
        ]);
    }, [chartData]);

    // SCORE AND RECOMMENDATIONS

    console.log(reportData);

    useEffect(() => {
        if (reportData) {
            const score = reportData[0].reports_overall_score_id_reports_overall_score.reports_overall_score_value;
            const maxScore = reportData[0].reports_overall_score_id_reports_overall_score.reports_overall_score_max_value;
            setScore(score);
            setMaxScore(maxScore);

            const recommendationLevel = reportData[0].reports_overall_score_id_reports_overall_score.overall_recommendations_id_overall_recommendations.recommendation_name;
            const recommendation = reportData[0].reports_overall_score_id_reports_overall_score.overall_recommendations_id_overall_recommendations.recommendation_description;
            setRecommendationLevel(recommendationLevel);
            setRecommendation(recommendation);
        }
    }, [reportData]);



        return (
            <>
                <div style={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: "8px",
                    height: "0.5rem",
                    width: "100%",
                    margin: "20px 0",
                    overflow: "hidden"
                }}>
                    <div style={{
                        width: '100%',
                        backgroundColor: "#4285F4",
                        height: "100%",
                        borderRadius: "8px",
                        transition: "width 0.3s ease-in-out"
                    }}>
                    </div>
                </div>
                <div>
                    <h1>Report</h1>
                </div>
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="radar"
                        width="700"
                    />
                </div>
                <div>
                    <p>Score: {score} / {maxScore} </p>
                    <p>{recommendationLevel}</p>
                    <p>{recommendation}</p>
                </div>
                <div>
                    <button>Save Report</button>
                </div>
            </>
        );
    };

    export default Report;