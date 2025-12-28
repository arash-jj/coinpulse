"use client"

import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData } from "@/lib/utils";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react"

const CandlestickChart = ({children, data, coinId, height = 360, initialPeriod = 'daily'}:CandlestickChartProps) => {
    const [period, setPeriod] = useState(initialPeriod);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();
    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
        const { days, interval } = PERIOD_CONFIG[selectedPeriod];
        const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
            vs_currency: 'usd',
            days,
            interval,
            precision: 'full',
        });
        startTransition(() => {
            setOhlcData(newData ?? []);
        });
        } catch (e) {
        console.error('Failed to fetch OHLCData', e);
        }
    };
    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;
        startTransition(async () => {
            setPeriod(newPeriod);
            await fetchOHLCData(newPeriod);
        });
    };
    useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const showTime = ['daily', 'weekly', 'monthly'].includes(period);
    const chart = createChart(container, {
        ...getChartConfig(height, showTime),
        width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
    const convertedToSeconds = ohlcData.map(
        (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
    );
    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent();
    chartRef.current = chart;
    candleSeriesRef.current = series;
    const observer = new ResizeObserver((entries) => {
        if (!entries.length) return;
        chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);
    return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        };
    }, [height, period]);
    useEffect(() => {
        if (candleSeriesRef.current) {
            const convertedToSeconds = ohlcData.map(
                (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
            );
            candleSeriesRef.current.setData(convertOHLCData(convertedToSeconds));
            chartRef.current?.timeScale().fitContent();
        }
    }, [ohlcData, period]);
    return (
        <div id="candlestick-chart">
            <div className="chart-header">
                <div className="flex-1">{children}
                    <div className="button-group">
                        <span className="text-sm font-medium text-purple-100/50">Period</span>
                        {PERIOD_BUTTONS.map(({value, label}) => (
                            <button 
                            key={value} 
                            className={period == value ? "config-button-active" : "config-button"} 
                            onClick={()=>handlePeriodChange(value)} 
                            disabled={isPending}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div ref={chartContainerRef} className="chart" style={{height}} />
        </div>
    )
}

export default CandlestickChart