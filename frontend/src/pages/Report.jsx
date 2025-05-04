import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';
import Chart from "react-apexcharts";
import DownloadPDFButton from "../components/PdfReport";
import ReportAnswers from "../components/ReportAnswers";

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

    return (
        <div className="global-container">
            <div className="create-project-container">
                <p>Report code <b>{reportCode}</b></p>
                <div className="d-flex flex-row justify-content-between w-100 mt-5">
                    <h1>Report</h1>
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
                <ReportAnswers
                    dimensionsData={dimensionsData}
                    showAnswers={showAnswers}
                    setShowAnswers={setShowAnswers}
                />
                <div>
                    <h3 className="mt-5 fs-4">Score: <span className="fs-3"><b>{score}</b></span> <span className="text-body-tertiary fs-5">/ {maxScore}</span></h3>
                    <div className="d-flex flex-row align-items-center mb-2">
                        <h3>Overall Responsibility Level  —
                            {recommendationLevel && (
                                <span className="ms-2" style={{
                                    color: recommendationLevel.search("1") >= 0 ? "#E0CA3C" :
                                        recommendationLevel.search("2") >= 0 ? "#53CAA1" :
                                            recommendationLevel.search("3") >= 0 ? "#226F54" : "000"
                                }}>
                                    {recommendationLevel}
                                </span>
                            )}
                        </h3>
                    </div>

                    <p className="my-4"><b>The overall responsibility level is calculated based on the average score from the dimensions of the framework. The levels are based on the average score.</b></p>

                    <h4 className="mt-5 mb-4">General Recommendations</h4>
                    <p>{recommendation}</p>
                </div>
                {
                    loadedGeneralData && loadedChartData && loadedDimensionsData && loadedScoreData && (
                        <DownloadPDFButton
                            token={token}
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