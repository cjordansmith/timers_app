//  ./public/js/app.js

//  TimersDashboard component to render two child components nested under div tags
//  TimersDashboard pass down prop isOpen to ToggleableTimerForm to determine whether to render a + or TimerForm
//  When ToggleableTimerForm is "open" the form is being displayed
class TimersDashboard extends React.Component {
    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList />
                    <ToggleableTimerForm isOpen={true} />
                </div>
            </div>
        );
    }
}

//  EditableTimerList component to render two EditableTimer components
//  one will render a timer's face
//  one will render a timer's edit form
class EditableTimerList extends React.Component {
    render() {
        return (
            <div id='timers'>
                <EditableTimer
                    title='Learn React'
                    projects='Web Domination'
                    elapsed='8986300'
                    runningSince={null}
                    editFormOpen={false}
                />
                <EditableTimer
                    title='Learn extreme ironing'
                    project='World domination'
                    elapsed='3890985'
                    runningSince={null}
                    editFormOpen={true}
                />
            </div>
        )
    }
}

//  EditableTimer component to return either a TimerForm or a Timer
//  based on the prop editFormOpen
class EditableTimer extends React.Component {
    render() {
        if (this.props.editFormOpen) {
            return (
                <TimerForm
                    title={this.props.title}
                    project={this.props.project}
                />
            );
        } else {
            return (
                <Timer
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                />
            );
        }
    }
}

//  TimerForm component to render a form for creating a new timer or edit existing
//  Contains two input fields TITLE and PROJECT, and two buttons
//  var submitText uses this.props.title to determine what text the submit button should display
//  if title is present - button displays Update, otherwise it displays Create
class TimerForm extends React.Component {
    render() {
        const submitText = this.props.title ? 'Update' : 'Create' ;
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' defaultValue={this.props.title} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' defaultValue={this.props.project} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>{submitText}</button>
                            <button className='ui basic red button'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//  Wrapper component around TimerForm
//  Displays either a + or a TimerForm
//  Accepts a single prop from its parents to instruct behavior - isOpen
//  TimerForm does not recieve any props from ToggleableTimerForm
//  TimerForm renders title and project fields empty
class ToggleableTimerForm extends React.Component {
    render() {
        if (this.props.isOpen) {
            return (
                <TimerForm />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button className='ui basic button icon'>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}

//  Timer componenet to render individual timers
//  elapsedString is stored in milliseconds
//  renderElapsedString changes time to a readable format HH:MM:SS
class Timer extends React.componenet {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>{this.props.title}</div>
                    <div className='meta'>{this.props.project}</div>
                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated edit icon'>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon'>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>Start</div>
            </div>
        );
    }
}
