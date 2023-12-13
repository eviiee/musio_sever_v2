import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
    title: string;
    data: {
        label : string;
        value : number;
        color : string;
    }[];
}

interface ChartData {
    labels : string[];
    datasets : {
        label : string;
        data : number[];
        backgroundColor : string[];
        
        hoverBackgroundColor? : string[];

        clip : number;

        hoverOffset : number;
        spacing : number;

        // borderJoinStyle : string;

        weight? : number;

        cutout : string;
    }[];
}

export default function DoughnutChart({
    title,data
} : DoughnutChartProps) {

    ChartJS.register(ArcElement, Tooltip);

    const labels : string[] = [];
    const values : number[] = [];
    const colors : string[] = [];

    data.forEach(d => {
        labels.push(d.label);
        values.push(d.value);
        colors.push(d.color);
    });

    const chartData : ChartData = {
        labels : labels,
        datasets: [
            {
                label: title,
                data: values,
                // backgroundColor: colors.map(c => `${c}33`),
                backgroundColor: colors,
                clip: 40,
                hoverOffset: 0,
                spacing: 0,
                // borderJoinStyle: 'round',
                weight: 10,
                cutout: '70%',
                hoverBackgroundColor: colors
            }
        ]
    }

    return <Doughnut data={chartData} />;
}
