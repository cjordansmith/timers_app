//  ./public/js/app.js

//  TimersDashboard component to render two child components nested under div tags
//  TimersDashboard pass down prop isOpen to ToggleableTimerForm to determine whether to render a + or TimerForm
//  When ToggleableTimerForm is "open" the form is being displayed
class TimersDashboard extends React.Component {

    /*  initialize the components state defaults    */
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now(),
            },{
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            },
        ],
    };

    //  create new timer form
    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    // pass props to updateTimer (attrs)
    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    };


    //  create the new timer
    createTimer = (timer) => {
        /*  create the timer    */
        const t = helpers.newTimer(timer);
        /*  append the new timer to 'timers' array and pass to setState   */
        this.setState({
            timers: this.state.timers.concat(t),
        });
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
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
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

    /*  initialize the state to closed  */
    state = {
        isOpen: false,
    };

    /*  opens the new timer form when   */
    handleFormOpen = () => {
        this.setState({ isOpen: true });
    };

    /*  close the form without saving  */
    handleFormClose = () => {
        this.setState({
            isOpen: false
        });
    };

    /*  close the form when new timer is created    */
    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({
            isOpen: false
        });
    };

    render() {
        if (this.state.isOpen) {
            /*  if state isOpen, display the TimerForm  */
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            /*  if state is not open, display the + to create new   */
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

    /*  initialize the components state defaults    */
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
            /*  if timer is STOPPED, show these fields  */
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
            /*  if timer is RUNNING, show these fields  */
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                />
            );
        }
    }
}

//  Timer componenet to render individual timers
//  elapsedString is stored in milliseconds
//  renderElapsedString changes time to a readable format HH:MM:SS
class Timer extends React.Component {
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
                        <span
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                        >
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

//  TimerForm component to render a form for creating a new timer or edit existing
//  Contains two input fields TITLE and PROJECT, and two buttons
//  var submitText uses this.props.title to determine what text the submit button should display
//  if title is present - button displays Update, otherwise it displays Create
class TimerForm extends React.Component {

    /*  set initial state of TimerForm  */
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '',
            project: this.props.project || '',
        };
    }

    /*  modify the TITLE state property */
    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        });
    };

    /*  modify the PROJECT state property */
    handleProjectChange = (e) => {
        this.setState({
            project: e.target.value
        });
    };

    /*  function to pass props to onFormSubmit()  */
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

//  specify WHICH React component to render and WHERE in the HTML document to render it
ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);
