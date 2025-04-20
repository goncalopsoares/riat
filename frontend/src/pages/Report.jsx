import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';
import Chart from "react-apexcharts";

const Report = () => {

    const [reportData, setReportData] = useState(null);
    const [chartCategories, setChartCategories] = useState([]);
    const [chartData, setChartData] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const getReport = async () => {
            const response = await api.get(`api/report/${id}/`);
            setReportData(response.data);
        }
        getReport();

    }, [id]);

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

    return (
        <>
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
        </>
    );
};

export default Report;