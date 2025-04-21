import { use, useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";
import api from '../api';
import Chart from "react-apexcharts";

const Report = () => {

    // general report data
    const [reportData, setReportData] = useState(null);
    const [creationTime, setCreationTime] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectOrganization, setProjectOrganization] = useState("");
    // chart data
    const [chartCategories, setChartCategories] = useState([]);
    const [chartData, setChartData] = useState([]);
    // dimensions and answers data
    const [dimensionsData, setDimensionsData] = useState([]);
    // score and recommendations
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [recommendationLevel, setRecommendationLevel] = useState(0);
    const [recommendation, setRecommendation] = useState("");



    const { id } = useParams();

    useEffect(() => {
        const getReport = async () => {
            const response = await api.get(`api/report/detail/${id}/`);
            setReportData(response.data);
        }
        getReport();
    }, [id]);

    // GENERAL REPORT DATA
    useEffect(() => {
        if (reportData) {
            const creationTime = reportData.report_creation_date;
            const formattedCreationTime = new Date(creationTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            setCreationTime(formattedCreationTime);

            const projectName = reportData.details.project.name;
            const prokectOrganization = reportData.details.project.organization;
            setProjectName(projectName);
            setProjectOrganization(prokectOrganization);
        }
    }, [reportData]);

    //CHART DATA
    const getChartCategories = () => {
        if (reportData) {
            const categories = reportData.details.dimension_scores.map(item => item.dimension_name);
            setChartCategories(categories);
            return categories;
        }
    }

    const getChartData = () => {
        if (reportData) {
            const data = reportData.details.dimension_scores.map(item => item.reports_score_dimension_score);
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
            const score = reportData.overall_score.reports_overall_score_value;
            const maxScore = reportData.overall_score.reports_overall_score_max_value;
            setScore(score);
            setMaxScore(maxScore);

            const recommendationLevel = reportData.overall_score.overall_recommendation.recommendation_name;
            const recommendation = reportData.overall_score.overall_recommendation.recommendation_description;
            setRecommendationLevel(recommendationLevel);
            setRecommendation(recommendation);
        }
    }, [reportData]);

    //STATEMENTS AND ANSWERS
    useEffect(() => {
        if (reportData?.details?.dimensions) {
            const formatted = reportData.details.dimensions.map(dimension => ({
                id: dimension.id,
                name: dimension.name,
                description: dimension.description,
                statements: dimension.statements.map(statement => ({
                    id: statement.id,
                    name: statement.name,
                    description: statement.description,
                    answers: statement.answers.map(answer => ({
                        id: answer.id,
                        value: answer.value,
                        creation_time: answer.creation_time
                    }))
                }))
            }));

            setDimensionsData(formatted);
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
                <p>{creationTime}</p>
                <p>{projectName}</p>
                <p>{projectOrganization}</p>
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
                {dimensionsData.map(dimension => (
                    <div key={dimension.id} className="mb-4">
                        <h2>{dimension.name}</h2>
                        <p>{dimension.description}</p>

                        {dimension.statements.map(statement => (
                            <div key={statement.id} className="ml-4 mb-2">
                                <strong>{statement.name}</strong>
                                <p>{statement.description}</p>

                                {statement.answers.map(answer => (
                                    <div key={answer.id} className="ml-4 text-sm text-gray-600">
                                        <span>Valor: {answer.value}</span><br />
                                        <span>Criado em: {new Date(answer.creation_time).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <p>Score: {score} / {maxScore} </p>
                <p>Overall Responsibility Level</p>
                <p>{recommendationLevel}</p>
                <p>The overall responsibility level is calculated based on the average score from the dimensions of the framework. The levels are based on the average score.</p>
                <p>{recommendation}</p>
            </div>
            <div>
                <button>Save Report</button>
            </div>
        </>
    );
};

export default Report;