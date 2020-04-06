import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

const columns = [
  { id: 'checkbox', label: 'Select', minWidth: 50 },
  { id: 'creditorName', label: 'Creditor', minWidth: 170 },
  { id: 'firstName', label: 'First Name', minWidth: 100 },
  {
    id: 'lastName',
    label: 'Last Name',
    minWidth: 170
  },
  {
    id: 'minPaymentPercentage',
    label: 'Min Pay%',
    minWidth: 170
  },
  {
    id: 'balance',
    label: 'Balance',
    minWidth: 170
  }
]

const removedIndexes = []

class Banks extends React.Component {
  constructor() {
    super()
    this.state = {
      data: [],
      checkboxesCounter: 0,
      balanceTotal: 0,
      selectedAll: false
    }
    this.removeHandler = this.removeHandler.bind(this)
    this.addHandler = this.addHandler.bind(this)
    this.handleCheckboxes = this.handleCheckboxes.bind(this)
  }

  handleCheckboxes(index) {
    if (removedIndexes.includes(index)) {
      removedIndexes.splice(removedIndexes.indexOf(index), 1)
      this.setState(state => {
        return {
          checkboxesCounter: state.checkboxesCounter - 1,
          balanceTotal: state.balanceTotal - state.data[index].balance
        }
      })
    } else {
      removedIndexes.push(index)
      this.setState(state => {
        return {
          checkboxesCounter: state.checkboxesCounter + 1,
          balanceTotal: state.balanceTotal + state.data[index].balance
        }
      })
    }
  }

  addHandler(event) {
    event.preventDefault()
    let newData = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      creditorName: event.target.creditorName.value,
      balance: event.target.balance.value,
      minPaymentPercentage: event.target.minPaymentPercentage.value,
      checkbox: false
    }
    this.setState(state => {
      return {
        data: [...state.data, newData]
      }
    })
  }

  removeHandler(indexes) {
    this.setState(state => {
      let newData = []
      for (let x = 0; x < state.data.length; x += 1) {
        if (!indexes.includes(x)) {
          newData.push(state.data[x])
        }
      }
      return {
        data: newData,
        balanceTotal: 0,
        checkboxesCounter: 0
      }
    })
    removedIndexes = []
  }

  checkAll() {
    if (!this.state.selectedAll) {
      this.setState(state => {
        let sum = 0
        for (let x = 0; x < state.data.length; x += 1) {
          sum += state.data[x].balance
        }
        return {
          checkboxesCounter: state.data.length,
          balanceTotal: sum,
          selectedAll: true
        }
      })
    } else {
      this.setState(() => {
        return {
          checkboxesCounter: 0,
          balanceTotal: 0,
          selectedAll: false
        }
      })
    }
  }

  componentDidMount() {
    const promise = axios.get(
      'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json'
    )
    promise.then(dataFromFile => {
      this.setState(() => ({
        data: dataFromFile.data
      }))
    })
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.id === 'checkbox' ? (
                        <div>
                          <Checkbox onChange={() => this.checkAll()} />{' '}
                          {column.label}
                        </div>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map(column => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id}>
                            {column.id === 'checkbox' ? (
                              <Checkbox
                                defaultChecked={false}
                                onChange={() => this.handleCheckboxes(index)}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <form onSubmit={event => this.addHandler(event)}>
              <input
                type="text"
                name="creditorName"
                defaultValue="creditorName"
              ></input>
              <input
                type="text"
                name="firstName"
                defaultValue="firstName"
              ></input>
              <input
                type="text"
                name="lastName"
                defaultValue="lastName"
              ></input>
              <input
                type="text"
                name="minPaymentPercentage"
                defaultValue="minPaymentPercentage"
              ></input>
              <input type="text" name="balance" defaultValue="balance"></input>
              <input type="submit" value="Add Debt" />
            </form>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => this.removeHandler(removedIndexes)}
            >
              Remove Debt
            </Button>
          </TableContainer>
        </Paper>
        <div>Total Row Count: {this.state.checkboxesCounter}</div>
        <div>Balance: {this.state.balanceTotal}</div>
      </div>
    )
  }
}

ReactDOM.render(<Banks />, document.getElementById('index'))
