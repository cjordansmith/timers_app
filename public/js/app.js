//  ./public/js/app.js

//  TimersDashboard component to render two child components nested under div tags
//  TimersDashboard pass down prop isOpen to ToggleableTimerForm to determine whether to render a + or TimerForm
//  When ToggleableTimerForm is "open" the form is being displayed
class TimersDashboard extends React.Component {

    //  initialize the components state set to a blank array
    state = {
        timers: [],
    };

    //  populate the app by making a request to the server
    componentDidMount() {
        //  calls loadTimersFromServer() function
        this.loadTimersFromServer();
        //  call every 5 seconds
        setInterval(this.loadTimersFromServer, 5000);
    }

    //  set the state based on the server request
    loadTimersFromServer = () => {
        //  calls client.getTimers() function
        //  makes the HTTP request to server, requesting the list of timers
        client.getTimers((serverTimers) => (
            //  when client hears back, triggers a new render
            //  populates the app with EditableTimer children and all of their children
            this.setState({
                timers: serverTimers
            })
        ));
    };

    //  create new timer form
    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    // pass props to updateTimer (attrs)
    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    };

    //  delete the desired timer from the state array
    handleTrashClick = (timerId) => {
        this.deleteTimer(timerId);
    };

    //  define function to handle START click
    handleStartClick = (timerId) => {
        this.startTimer(timerId);
    };

    //  define function to handle STOP click
    handleStopClick = (timerId) => {
        this.stopTimer(timerId);
    };


    //  create the new timer
    createTimer = (timer) => {
        //  create the timer
        const t = helpers.newTimer(timer);
        //  append the new timer to 'timers' array and pass to setState
        this.setState({
            timers: this.state.timers.concat(t),
        });
        client.createTimer(t);
    };

    //  traverse the array of timer objects, update timer
    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    //  if timer's id matches that of the submitted form, return a new object with the updated attributes
                    return Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project,
                    });
                } else {
                    //  if timer's id does not match the submitted form, return the original timer
                    return timer;
                }
            }),
        });
        client.updateTimer(attrs);
    };

    //  show the timer object that has an id matching timerId being removed
    deleteTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(t => t.id !== timerId),
        });
        client.deleteTimer(
            {
                id: timerId
            }
        );
    };

    //  START the timer
    startTimer = (timerId) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: now,
                    });
                } else {
                    return timer;
                }
            }),
        });
        client.startTimer(
            {
                id: timerId,
                start: now
            }
        );
    };

    // STOP the timer
    stopTimer = (timerId) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({}, timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    });
                } else {
                    return timer;
                }
            }),
        });
        client.stopTimer(
            {
                id: timerId,
                start: now
            }
        );
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleTrashClick}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                </div>
            </div>
        );
    }
}

//  Wrapper component around TimerForm
//  Accepts a single prop from its parents to instruct behavior - isOpen
//  TimerForm does not recieve any props from ToggleableTimerForm
//  TimerForm renders title and project fields empty
class ToggleableTimerForm extends React.Component {

    //  initialize the state to closed
    state = {
        isOpen: false,
    };

    //  opens the new timer form when
    handleFormOpen = () => {
        this.setState({ isOpen: true });
    };

    //  close the form without saving
    handleFormClose = () => {
        this.setState({
            isOpen: false
        });
    };

    //  close the form when new timer is created
    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({
            isOpen: false
        });
    };

    render() {
        if (this.state.isOpen) {
            //  if state isOpen, display the TimerForm
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            //  if state is not open, display the + to create new
            return (
                <div className='ui basic content center aligned segment'>
                    <button className='ui basic button icon' onClick={this.handleFormOpen}>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}

//  EditableTimerList component to render two EditableTimer components
//  one will render a timer's face
//  one will render a timer's edit form
class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map((timer) => (
            <EditableTimer
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                onTrashClick={this.props.onTrashClick}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
            />
        ));
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

//  EditableTimer component to return either a TimerForm or a Timer
//  based on the prop editFormOpen
class EditableTimer extends React.Component {

    //  initialize the components state defaults
    state = {
        editFormOpen: false,
    };

    //  when EDIT button is clicked, call function openForm()
    handleEditClick = () => {
        this.openForm();
    };

    //  when CLOSE button is clicked, call function closeForm()
    handleFormClose = () => {
        this.closeForm();
    };

    //  when timer is editted, pass props to onFormSubmit(timer)
    //  call function closeForm()
    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    //  change the state of editFormOpen to false
    closeForm = () => {
        this.setState({
            editFormOpen: false
        });
    };

    //  change the state of editFormOpen to open
    openForm = () => {
        this.setState({
            editFormOpen: true
        });
    };

    render() {
        if (this.state.editFormOpen) {
            //  if timer is STOPPED, show these fields
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            //  if timer is RUNNING, show these fields
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onTrashClick={this.props.onTrashClick}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                />
            );
        }
    }
}

//  Timer componenet to render individual timers
//  elapsedString is stored in milliseconds
//  renderElapsedString changes time to a readable format HH:MM:SS
class Timer extends React.Component {

    //  invoke the forceUpdate() function every 50ms to re-render the component
    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }

    //  stop the inverval this.forceUpdateInterval
    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
    }

    //  define function to handle START button click events
    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
    };

    //  define function to handle STOP button click events
    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
    };

    //  define function to handle TRASH button click events
    handleTrashClick = () => {
        this.props.onTrashClick(this.props.id);
    };

    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);

        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>{this.props.title}</div>
                    <div className='meta'>{this.props.project}</div>
                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className='extra content'>
                        <span
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                        >
                            <i className='edit icon' />
                        </span>
                        <span
                            className='right floated trash icon'
                            onClick={this.handleTrashClick}
                        >
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}

//  START and STOP buttons
class TimerActionButton extends React.Component {
    render() {
        if (this.props.timerIsRunning) {
            return (
                <div
                    className='ui bottom attached red basic button'
                    onClick={this.props.onStopClick}
                >
                    Stop
                </div>
            );
        } else {
            return (
                <div
                    className='ui bottom attached green basic button'
                    onClick={this.props.onStartClick}
                >
                    Start
                </div>
            );
        }
    }
}

//  TimerForm component to render a form for creating a new timer or edit existing
//  Contains two input fields TITLE and PROJECT, and two buttons
//  var submitText uses this.props.title to determine what text the submit button should display
//  if title is present - button displays Update, otherwise it displays Create
class TimerForm extends React.Component {

    //  set initial state of TimerForm
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '',
            project: this.props.project || '',
        };
    }

    //  modify the TITLE state property
    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        });
    };

    //  modify the PROJECT state property
    handleProjectChange = (e) => {
        this.setState({
            project: e.target.value
        });
    };

    //  function to pass props to onFormSubmit()
    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                                type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>

                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>

                            <button
                                className='ui basic red button'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//  specify WHICH React component to render and
//  specify WHERE in the HTML document to render it
ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);
