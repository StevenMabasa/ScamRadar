import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from './Card.jsx';

export default function ProgressChart({ title, data, type = 'bar', dataKey, xKey = 'name', color = '#23d7ff' }) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#1c3a43" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#0b1820',
                border: '1px solid #1c3a43',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
            />
            {type === 'line' ? (
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3 }} />
            ) : (
              <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
