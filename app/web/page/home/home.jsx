import React from 'react';
import request from 'superagent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class SimpleLineChart extends React.Component {
    state = {
        data: [],
        width: 1200
    };

    componentWillMount() {
        if (typeof window !== 'undefined') {
            this.setState({
                width: window.innerWidth
            })
        }
        request.get('/api/trade/kline')
            .query({
                symbol: 'btc',
                type: '1day'
            })
            .end((err, { body: { data } }) => {
                this.setState({ data });
            })
    }

    render() {
        const { width, data } = this.state;
        console.log(data);
        return (
            <LineChart width={width} height={600} data={data}
                       margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="10 10"/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="btc" stroke="#8884d8"  activeDot={{r: 8}}/>
                <Line type="monotone" dataKey="qtum" stroke="#82ca9d"/>
            </LineChart>
        )
    }
}
