import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export function WinRateChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Win Rate %',
            data: data.values,
            borderColor: '#cc0000',
            backgroundColor: 'rgba(204, 0, 0, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#cc0000',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 12 } },
          },
          title: {
            display: true,
            text: 'Win Rate Over Time',
            color: '#fff',
            font: { size: 14, weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          x: {
            ticks: { color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxHeight: '300px' }} />;
}

export function MatchTypeDistribution({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: [
              '#cc0000',
              '#ff6b6b',
              '#ffa500',
              '#ffff00',
              '#00ff00',
              '#0000ff',
              '#9933ff',
            ],
            borderColor: '#000',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 11 } },
            position: 'right',
          },
          title: {
            display: true,
            text: 'Match Type Distribution',
            color: '#fff',
            font: { size: 14, weight: 'bold' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxHeight: '300px' }} />;
}

export function PromotionComparison({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Average Match Quality',
            data: data.values,
            backgroundColor: '#cc0000',
            borderColor: '#ff0000',
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 12 } },
          },
          title: {
            display: true,
            text: 'Promotion Comparison',
            color: '#fff',
            font: { size: 14, weight: 'bold' },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          y: {
            ticks: { color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxHeight: '300px' }} />;
}
