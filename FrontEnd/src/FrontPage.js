import React, { Component } from 'react'
import Axios from 'axios'

class FrontPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      theState: '',
      foundRep: false,
      representatives: [],
      rep: [],
      entryError: false
    }
  }
  findRep () {
    if (this.state.theState.length !== 2) {
      this.setState({ entryError: true })
      return null
    }
    Axios.get(`http://localhost:3000/representatives/${this.state.theState}`)
    .then(response => {
      if (response.data.results === undefined) this.setState({ entryError: true })
      this.setState({ representatives: response.data.results })
      return response
    }).then(resp => {
      console.log('resp', resp)
      if (!resp.data.success) {
        return null
      } else {
        this.setState({ foundRep: true })
      }
    })
  }
  findSenator () {
    if (this.state.theState !== 2) {
      this.setState({ entryError: true })
    }
    Axios.get(`http://localhost:3000/senators/${this.state.theState}`)
    .then(response => {
      if (response.data.results === undefined) {
        this.setState({ entryError: true })
      }
      this.setState({ representatives: response.data.results })
      return response
    }).then(resp => {
      if (!resp.data.success) {
        return null
      } else {
        this.setState({ foundRep: true })
      }
    })
  }
  displayFrontPage () {
    return (
      <div className='front-page-container'>
        <h1>
          Find Your Senator or Representative!
        </h1>
        <div className='pick-my-state'>
          <h1>Your State: </h1>
          <input
            type='text'
            size='2'
            value={this.state.theState}
            onChange={(text) => this.setState({ theState: text.target.value })} />
          {this.state.theState.length > 2 ? <p className='state-input-error'>Only 2 letter abreviation please</p> : null}
          {this.state.entryError ? <p className='state-input-error'>Enter correct 2 letter abreviation please</p> : null}
        </div>
        <div className='button-lines'>
          <span
            className='my-button find-representative-button'
            onClick={() => this.findRep()}>
            Find Representative
          </span>
          <span
            className='my-button find-senator-button'
            onClick={() => this.findSenator()}>Find Senator</span>
        </div>
      </div>
    )
  }

  displayAllReps () {
    return (
      <div className='front-page-container'>
        <h1>All Reps</h1>
        <ul>
          {this.state.representatives.map(rep => {
            return (
              <li
                onClick={() => this.setState({ rep: rep })}
                key={rep.phone}>
                {rep.name} - {rep.party}
              </li>
            )
          })}
        </ul>
        <div
          className='my-button reset-button'
          onClick={() => this.setState({
            foundRep: false,
            theState: '',
            representatives: [],
            rep: [],
            entryError: false
          })}>Reset</div>
      </div>
    )
  }
  displayRepDetails () {
    return (
      <div className='front-page-container'>
        <h1>Rep Details</h1>
        <div className='representative-detail-card'>
          <h1>{this.state.rep.name} - {this.state.rep.party}</h1>
          <p>State: {this.state.rep.state}</p>
          <p>Phone: {this.state.rep.phone}</p>
          <p>Office: {this.state.rep.office}</p>
          <p>Website:
            <a href={this.state.rep.link}>
              {this.state.rep.link}
            </a>
          </p>
        </div>
        <div
          className='my-button reset-button'
          onClick={() => this.setState({
            foundRep: false,
            theState: '',
            representatives: [],
            rep: [],
            entryError: false
          })}>Reset</div>
      </div>
    )
  }
  render () {
    if (!this.state.foundRep) {
      return this.displayFrontPage()
    } else if (this.state.foundRep && this.state.rep.length === 0) {
      return this.displayAllReps()
    } else if (this.state.rep.length !== 0) {
      return this.displayRepDetails()
    }
    return (
      <div>Start Over</div>
    )
  }
}

export default FrontPage
