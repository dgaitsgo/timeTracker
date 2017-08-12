import React, { Component } from 'react'
import '../node_modules/materialize-css/dist/css/materialize.css'

// Why is there so much component in this file?
// One component per file

// Why using the function keyword instead of an arrow funcition () => ?
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const appendZero = seconds < 10 ? '0' : ''
  return (`${minutes}:${appendZero}${seconds}`)
}

function timeStringToSeconds(mins, secs) {
  return (parseInt(mins) * 60 + parseInt(secs))
}


class NewTask extends Component {

  state = {
    inCourse : false,
    message : 'Go!',
    taskName : '',
    elapsedTime : 0,
    warnAfter : 0,
    shouldTake: 0,
    buttonClass : 'pink darken-1',
    startTime : '',

    shouldMins : '',
    shouldSecs : '',
    warnMins : '',
    warnSecs : '',

    canSubmit : false

  }

  timerRef = null

  validateSubmission = () => {
    //what a fugly function
    const {
      taskName,
      shouldMins,
      shouldSecs,
      warnMins,
      warnSecs
    } = this.state

    // nice indent
      if (taskName.length > 0 &&
          (shouldMins.length > 0 || shouldSecs.length > 0) &&
          (warnMins.length > 0 ||   warnSecs.length > 0)) {
            this.setState({canSubmit : true})
          } else {
            this.setState({canSubmit : false})
          }
  }

  resetFields = () => {
    this.setState({
      taskName : '',
      shouldMins : '',
      shouldSecs : '',
      warnMins : '',
      warnSecs : '',
    })
  }

  updateTaskName = ({ target : { value } }) => this.setState({taskName : value})

  updateTime = () => {
    // When you want to setState using the actual state, it's
    // good to pass a function to setState instead of an object
    // https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b
    const elapsedTime = this.state.elapsedTime + 1
    this.setState({elapsedTime})
  }

  startTimer = () => this.timerRef = setInterval(this.updateTime, 1000)

  stopTimer = () => clearInterval(this.timerRef)

  pauseTimer = () => { }

  onClick = () => {
    const { inCourse, elapsedTime, taskName, shouldMins, shouldSecs } = this.state
    const active = !inCourse
    const message = active ? 'Done!' : 'Go!'
    const buttonClass = active ? 'green darken-2' : 'pink darken-2'
    console.log(shouldMins, shouldSecs)
    if (!active) {
      this.stopTimer()
      this.resetFields()
      this.props.uponFinishing({
        taskName,
        elapsedTime,
        shouldTake : timeStringToSeconds(shouldMins, shouldSecs)
      })
    } else {
      this.startTimer()
    }

    this.setState({
      message,
      buttonClass,
      elapsedTime : 0,
      inCourse : active,
      canSubmit : active,
    })
  }

  updateField = (e) => {
    const {id, value} = e.target
    //Don't allow any non numeric characters and cutt off all nums
    //after the units place if it's seconds

    var nvalue = value.replace(/\D/g,'')
    var nvalue = (id === 'shouldSecs' || id === 'warnSecs') ? nvalue.slice(0, 2) : nvalue

    if (id === 'shouldSecs' || id === 'warnSecs') {
      if (nvalue.length > 2 || (parseInt(nvalue) === NaN || parseInt(nvalue) > 60)) {
        return ;
      }
    }
    this.setState({ [id] : nvalue }, this.validateSubmission)
  }

  render () {

    const {
      message,
      buttonClass,
      startTime,
      elapsedTime,
      taskName,
      shouldMins,
      shouldSecs,
      warnMins,
      warnSecs,
      inCourse,
      canSubmit
    } = this.state

    return (
      <div className="log">
        <div className="container">

          <div className="row">

          {/* nice ident +
            This is way too repetitive. You should wrap this
            inside a component
          */}
           <div className={"input-field col s4"}>
             <input disabled={inCourse} value={taskName} onChange={this.updateTaskName} id="taskName" type="text" className="validate"></input>
             <label className="active purple-text text-darken-4" htmlFor="taskName">Task Name</label>
           </div>

          <div className={"input-field inline col s2"}>
            <input disabled={inCourse} placeholder="mins" value={shouldMins} onChange={this.updateField} onBlur={this.validateField} id="shouldMins" type="text" className="validate"></input>
            <label className="active purple-text text-darken-4" htmlFor="estimateMin">Should take</label>
          </div>
          <div className={"input-field inline col s1"}>
            <input disabled={inCourse} placeholder="secs" value={shouldSecs} onChange={this.updateField} onBlur={this.validateField} id="shouldSecs" type="text" className="validate"></input>
          </div>

          <div className={"input-field inline col s2"}>
            <input disabled={inCourse} placeholder="mins" value={warnMins} onChange={this.updateField} onBlur={this.validateField} id="warnMins" type="text" className="validate"></input>
            <label className="active purple-text text-darken-4" htmlFor="estimateMin">Warn after</label>
          </div>
          <div className={"input-field inline col s1"}>
            <input disabled={inCourse} placeholder="secs" value={warnSecs} onChange={this.updateField} onBlur={this.validateField} id="warnSecs" type="text" className="validate"></input>
          </div>
        </div>
        <div className="row">
          <div className="col s2">
            <a onClick={this.onClick} className={"waves-effect waves-light btn " + buttonClass + (canSubmit ? '' : ' disabled')}>{message}</a>
          </div>
          <div className="col s1">
            <a className=" grey-text text-darken-4 waves-effect waves-light btn white">{formatTime(elapsedTime)}</a>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
// Why using a class?
// This component doesn't use state or lifecycle React method
// You can replace it by a simple function that returns HTML
// like this
/*
const Log = ({ tasks }) => (
  <table>
    <thead>
      <tr>
        <th>Task Name</th>
        <th>Took</th>
        <th>Thought it would take</th>
        <th>Off by</th>
      </tr>
    </thead>

    <tbody>
      {tasks.map( (t, i) => {
        const err = t.shouldTake - t.elapsedTime
        var className, sign;
        if (err < 0) {
          className = 'pink-text text-darken-1'
          sign = '-'
        } else {
          className = 'green-text'
          sign = '+'
        }

        return (
          <tr key={i}>
            <td>{t.taskName}</td>
            <td>{formatTime(t.elapsedTime)}</td>
            <td>{formatTime(t.shouldTake)}</td>
            <td className={className}>{sign}{formatTime(Math.abs(err))}</td>
          </tr>
        )
      })}
    </tbody>
  </table>
)
*/
class Log extends Component {

  render () {
    const { tasks } = this.props

    return (
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Took</th>
            <th>Thought it would take</th>
            <th>Off by</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map( (t, i) => {
            // There is too much logic here
            // maybe you should move this logic away
            // to stay focus on the view here
            const err = t.shouldTake - t.elapsedTime
            var className, sign;
            if (err < 0) {
              className = 'pink-text text-darken-1'
              sign = '-'
            } else {
              className = 'green-text'
              sign = '+'
            }

            return (
              <tr key={i}>
                <td>{t.taskName}</td>
                <td>{formatTime(t.elapsedTime)}</td>
                <td>{formatTime(t.shouldTake)}</td>
                <td className={className}>{sign}{formatTime(Math.abs(err))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>)
  }
}

class App extends Component {

  state = {
    tasks : []
  }

  newTask = (task) => {
    // Here, you can use the spread operator coupled
    // with a function instead of the concat.
    // like this:
    /*
    this.setState((state) => ({ tasks: [...state.tasks, task] }))
    */
    const { tasks } = this.state
    this.setState({tasks : tasks.concat(task)}, this.check)
  }

  render() {
    const { tasks } = this.state

    return (
      <div className="App">
        <div className="col s1 right-align" style={{padding : '2vh'}}>
          <a className="waves-effect waves-light btn orange darken-2">
            <i className="material-icons md-24 right">call_made</i>export
          </a>
        </div>
        <div className="container">
          <h2 className="center-align" style={{paddingBottom : '2vh'}}> Time Tracker </h2>
          <div className="section">
            <NewTask
              uponFinishing={this.newTask}
            />
          </div>
          <div className="section">
            <div className="row">
              <div className="col s12">
                <h4 className=""> Log
                </h4>
              </div>
            </div>
            <Log
              tasks={tasks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App
