import React from 'react';
import ReactDOM from 'react-dom';
import {Card} from 'antd'
import "./index.less";

class App extends React.Component {

    render() {
        return (
            <Card>哒哒</Card>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);