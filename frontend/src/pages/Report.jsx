import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';
import Chart from "react-apexcharts";
import DownloadPDFButton from "../components/PdfReport";

const Report = () => {

    // general report data
    const [reportData, setReportData] = useState(null);
    const [creationTime, setCreationTime] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectOrganization, setProjectOrganization] = useState("");
    const [loadedGeneralData, setLoadedGeneralData] = useState(false);
    const [reportCode, setReportCode] = useState('');
    // chart data
    const [chartCategories, setChartCategories] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loadedChartData, setLoadedChartData] = useState(false);
    // dimensions and answers data
    const [showAnswers, setShowAnswers] = useState(false);
    const [dimensionsData, setDimensionsData] = useState([]);
    const [loadedDimensionsData, setLoadedDimensionsData] = useState(false);
    // score and recommendations
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [recommendationLevel, setRecommendationLevel] = useState(0);
    const [recommendation, setRecommendation] = useState("");
    const [loadedScoreData, setLoadedScoreData] = useState(false);



    const { token } = useParams();

    useEffect(() => {
        const getReport = async () => {
            const response = await api.get(`api/report/detail/${token}/`);
            setReportData(response.data);
            setReportCode(token)
        }
        getReport();
    }, [token]);

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

            setLoadedGeneralData(true);
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
        setLoadedChartData(true);
    }, [reportData]);

    const [options, setOptions] = useState({
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                }
            },
        },
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
            name: "Total Dimension Score",
            data: []
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                name: "Total Dimension Score",
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
            setLoadedScoreData(true);

            const recommendationLevel = reportData.overall_score.overall_recommendation.recommendation_name;
            const recommendation = reportData.overall_score.overall_recommendation.recommendation_description;
            setRecommendationLevel(recommendationLevel);
            setRecommendation(recommendation);
            setLoadedScoreData(true);
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
                    scale_labels: statement.scale_labels,
                    answers: statement.answers.map(answer => ({
                        id: answer.id,
                        value: answer.scale_label !== null ? answer.scale_label : answer.value,

                    }))
                }))
            }));

            setDimensionsData(formatted);
            setLoadedDimensionsData(true);
        }
    }, [reportData]);

    console.log(dimensionsData);


    return (
        <div className="global-container">
            <div className="create-project-container">
                <div className="d-flex flex-row justify-content-between w-100 mt-5">
                    <div>
                        <h1>Report</h1>
                        <p>{reportCode}</p>
                    </div>
                    <div className="text-end">
                        <p>Report created on <b>{creationTime}</b></p>
                        <p>Regarding the project <b>{projectName}</b></p>
                    </div>
                </div>
                <div className="text-center mb-4 w-100 justify-content-center margin-auto chart-container">
                    <h4 className="m-0">Responsible Innovation Dimensions</h4>
                    <div className="mixed-chart" style={{ display: "flex", justifyContent: "center" }}>
                        <Chart
                            options={options}
                            series={series}
                            type="radar"
                            width="900"
                        />
                    </div>
                </div>
                {
                    showAnswers ? (
                        <button onClick={() => setShowAnswers(false)} className="forms-button">Hide Answers</button>
                    ) : (
                        <button onClick={() => setShowAnswers(true)} className="forms-button">Show Answers</button>
                    )
                }
                {
                    showAnswers && (
                        <div className="answers-container">
                            {dimensionsData.map((dimension, dimensionIndex) => (
                                <div key={dimension.id} className="mb-4">
                                    <h2>{dimensionIndex + 1}. {dimension.name}</h2>
                                    <p>{dimension.description}</p>

                                    {dimension.statements.map((statement, statementIndex) => (
                                        <div key={statement.id} className="my-4">
                                            <b>{dimensionIndex + 1}.{statementIndex + 1}. {statement.name}</b>
                                            <p><em>{statement.description}</em></p>

                                            {statement.answers.map(answer => (
                                                <div key={answer.id} className="ml-4 text-sm text-gray-600">
                                                    <p className="m-0">Your answer:</p>
                                                    {statement.scale_labels.split(",").map((label, index) => (
                                                        label === answer.value ? (
                                                            <span key={index} className="scale-labels me-3"><b style={{ color: '#0091be' }}>{label}</b></span>
                                                        ) : (
                                                            <span key={index} className="scale-labels me-3">{label}</span>
                                                        )
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {dimensionIndex !== dimensionsData.length - 1 && (
                                        <div className="border-bottom border-3 mb-4"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                }
                <div>
                    <p>Score: {score} / {maxScore} </p>
                    <p>Overall Responsibility Level</p>
                    <p>{recommendationLevel}</p>
                    <p>The overall responsibility level is calculated based on the average score from the dimensions of the framework. The levels are based on the average score.</p>
                    <p>{recommendation}</p>
                </div>
                {
                    loadedGeneralData && loadedChartData && loadedDimensionsData && loadedScoreData && (
                        <DownloadPDFButton
                            creationTime={creationTime}
                            projectName={projectName}
                            projectOrganization={projectOrganization}
                            series={series}
                            options={options}
                            dimensionsData={dimensionsData}
                            score={score}
                            maxScore={maxScore}
                            recommendationLevel={recommendationLevel}
                            recommendation={recommendation}
                        />
                    )
                }
            </div >
        </div >
    );
};

export default Report;