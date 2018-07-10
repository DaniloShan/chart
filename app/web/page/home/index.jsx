import React from 'react';
import request from 'superagent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import URI from 'urijs';
import colors from '../../../utils/colors';

class SimpleLineChart extends React.Component {
    state = {
        data: [],
        width: 1200,
        size: 200,
    };

    constructor(props) {
        super(props);
        this.query = URI.parseQuery(props.location.search);
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            this.setState({
                width: window.innerWidth
            })
        }
        this.refresh();
    }

    refresh = (e) => {
        e && e.preventDefault();
        const { symbol = 'bitcoin', percent = 0.06, start, end } = this.query;
        request.get('/api/trend')
            .query({
                symbol,
                percent,
                start,
                end
            })
            .end((err, { body: { data } }) => {
                this.setState({ data });
            })
    };

    render() {
        const { width, data } = this.state;
        return (
            <div>
                <LineChart width={width} height={600} data={data}
                           margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="10 10"/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="price" stroke={colors[0]} key="price"/>
                </LineChart>
            </div>
        )
    }
}

export default SimpleLineChart;
