import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Chart from './component/Chart'

class Banks extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const promise = axios.get(
      'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json'
    )
    promise.then(dataFromFile => {
      this.setState(()=>({
        data: dataFromFile.data
      }))
    })
  }
  render() {
    return <div>Hello React!
      <Chart props={this.state}/>
      </div>
  }
}

ReactDOM.render(<Banks />, document.getElementById('index'))
