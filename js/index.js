"use strict";

// Navigation bar component for display at top
var NavBar = React.createClass({
  displayName: "NavBar",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "top-bar" },
        React.createElement(
          "div",
          { className: "top-bar-left" },
          React.createElement(
            "ul",
            { className: "menu" },
            React.createElement(
              "li",
              { className: "menu-text" },
              "Pomodoro Clock"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "top-bar-right" },
          React.createElement(
            "ul",
            { className: "menu" },
            React.createElement(
              "li",
              { className: "menu-text" },
              "Created by ",
              React.createElement(
                "a",
                { href: "http://www.kartikgola.com", target: "_blank" },
                " Kartik Gola "
              )
            )
          )
        )
      )
    );
  }
});

// Pomodoro Clock component that holds state
var Pomodoro = React.createClass({
  displayName: "Pomodoro",

  getInitialState: function getInitialState() {
    return {
      status: 'stopped',
      minutes: 25,
      breakLength: 5,
      count: 25 * 60,
      audio: 'off'
    };
  },

  handlePlay: function handlePlay() {
    var _this = this;

    if (this.state.status !== 'working') {
      (function () {
        _this.setState({ status: 'working' });

        var that = _this;
        var clockInstance = setInterval(function () {
          var c = that.state.count;
          var status = that.state.status;

          if (status == 'working') {
            if (c == 0) {
              if (that.state.audio == 'on') {
                document.getElementById('workoutOver').volume = 1.0;
                document.getElementById('workoutOver').play();
              }
              that.setState({ status: 'onbreak', count: that.state.breakLength * 60 });
            } else that.setState({ count: --c });
          } else if (status == 'onbreak') {
            if (c == 0) {
              if (that.state.audio == 'on') {
                document.getElementById('breakOver').volume = 1.0;
                document.getElementById('breakOver').play();
              }
              that.setState({ status: 'stopped', count: that.state.minutes * 60 });
              clearInterval(clockInstance);
            } else that.setState({ count: --c });
          } else clearInterval(clockInstance);
        }, 1000);
      })();
    }
  },

  handlePause: function handlePause() {
    if (this.state.status == 'working' || this.state.status == 'onbreak') {
      this.setState({
        status: 'paused'
      });
    }
  },

  handleStop: function handleStop() {
    if (this.state.status !== 'stopped') {
      this.setState({
        status: 'stopped',
        count: this.state.minutes * 60
      });
    }
  },

  handleBreakChange: function handleBreakChange(newBreak) {
    if (newBreak >= 1 && newBreak <= 50) this.setState({ breakLength: newBreak });
  },

  handleMinutesChange: function handleMinutesChange(newMin) {
    if (newMin >= 1 && newMin <= 100) this.setState({ minutes: newMin, count: newMin * 60 });
  },

  handleAudioClick: function handleAudioClick(newAudio) {
    this.setState({ audio: newAudio });
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "columns small-8 small-offset-2 medium-6 medium-offset-3 large-4 large-offset-4 text-center" },
          React.createElement(Clock, { totalSeconds: this.state.count })
        ),
        React.createElement(
          "div",
          { className: "columns small-2 medium-3 large-4 audio-button" },
          React.createElement(Audio, { onAudioClick: this.handleAudioClick })
        )
      ),
      React.createElement(Buttons, { onPlay: this.handlePlay, onPause: this.handlePause, onStop: this.handleStop, clockStatus: this.state.status }),
      React.createElement(Controls, { onBreakChange: this.handleBreakChange, onMinutesChange: this.handleMinutesChange })
    );
  }
});

// Displays the clock with number countdown
var Clock = React.createClass({
  displayName: "Clock",

  getDefaultProps: function getDefaultProps() {
    return {
      totalSeconds: 25 * 60
    };
  },

  propTypes: {
    totalSeconds: React.PropTypes.number
  },

  formatSeconds: function formatSeconds(totalSeconds) {
    var sec = totalSeconds % 60;
    var min = Math.floor(totalSeconds / 60);

    if (sec < 10) sec = '0' + sec;
    if (min < 10) min = '0' + min;
    return min + ':' + sec;
  },

  render: function render() {
    var totalSeconds = this.props.totalSeconds;

    return React.createElement(
      "div",
      { className: "clock" },
      React.createElement(
        "span",
        { className: "clock-text" },
        this.formatSeconds(totalSeconds)
      )
    );
  }
});

// Clock controls of Break and Workout
var Controls = React.createClass({
  displayName: "Controls",

  onBreakChange: function onBreakChange(e) {
    // Update pomo breakLength
    // let val = $('#inp_break').val();
    // if ( val < 1 || val > 50 )
    //   $('#inp_break').val(5);
    this.props.onBreakChange($('#inp_break').val());
  },

  onMinutesChange: function onMinutesChange(e) {
    // Update minutes in pomo and clock display
    // let val = $('#inp_minutes').val();
    // if ( val < 5 || val > 100 )
    //   $('#inp_minutes').val(25);
    this.props.onMinutesChange($('#inp_minutes').val());
  },

  render: function render() {

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "columns small-4 text-center" },
          React.createElement(
            "span",
            { className: "control-label" },
            " Break "
          )
        ),
        React.createElement(
          "div",
          { className: "columns small-4 text-center" },
          React.createElement("input", { type: "number", className: "text-center", id: "inp_break", defaultValue: 5, onChange: this.onBreakChange, min: "1", max: "50" })
        ),
        React.createElement(
          "div",
          { className: "columns small-4" },
          React.createElement(
            "span",
            { className: "control-range" },
            " ( 1 - 50 )"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "columns small-4 text-center" },
          React.createElement(
            "span",
            { className: "control-label" },
            " Workout "
          )
        ),
        React.createElement(
          "div",
          { className: "columns small-4 text-center" },
          React.createElement("input", { type: "number", className: "text-center", id: "inp_minutes", defaultValue: 25, onChange: this.onMinutesChange, min: "1", max: "100" })
        ),
        React.createElement(
          "div",
          { className: "columns small-4" },
          React.createElement(
            "span",
            { className: "control-range" },
            " ( 1 - 100 )"
          )
        )
      )
    );
  }
});

// Play, Pause and Stop buttons
var Buttons = React.createClass({
  displayName: "Buttons",

  getDefaultProps: function getDefaultProps() {
    return {
      clockStatus: 'stopped'
    };
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.props.clockStatus == 'stopped') $('#btnPlay').attr('disabled', false);
  },

  onClickPlay: function onClickPlay(e) {
    e.preventDefault();
    if ($('#inp_break').val() < 1 || $('#inp_break').val() > 50) $('#inp_break').val(5);
    if ($('#inp_minutes').val() < 1 || $('#inp_minutes').val() > 100) $('#inp_minutes').val(25);
    $('#btnPlay').attr('disabled', true);
    $('#inp_break').attr('disabled', true);
    $('#inp_minutes').attr('disabled', true);
    this.props.onPlay();
  },

  onClickPause: function onClickPause(e) {
    e.preventDefault();
    if ($('#btnPlay').attr('disabled')) $('#btnPlay').attr('disabled', false);
    this.props.onPause();
  },

  onClickStop: function onClickStop(e) {
    e.preventDefault();
    $('#btnPlay').attr('disabled', false);
    $('#inp_break').attr('disabled', false);
    $('#inp_minutes').attr('disabled', false);
    this.props.onStop();
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "button-group columns small-12 small-centered text-center" },
          React.createElement(
            "button",
            { className: "success button", id: "btnPlay", onClick: this.onClickPlay },
            "Play ",
            React.createElement("i", { className: "fa fa-play" })
          ),
          React.createElement(
            "button",
            { className: "warning button", id: "btnPause", onClick: this.onClickPause },
            "Pause ",
            React.createElement("i", { className: "fa fa-pause" })
          ),
          React.createElement(
            "button",
            { className: "alert button", id: "btnStop", onClick: this.onClickStop },
            "Stop ",
            React.createElement("i", { className: "fa fa-stop" })
          )
        )
      )
    );
  }
});

// Audio component
var Audio = React.createClass({
  displayName: "Audio",

  onAudioClick: function onAudioClick(e) {
    // toggle button class
    document.getElementById('workoutOver').volume = 0.0;
    document.getElementById('workoutOver').play();
    document.getElementById('breakOver').volume = 0.0;
    document.getElementById('breakOver').play();

    var audio = '';
    if ($('#faAudio').hasClass('fa-volume-up')) {
      $('#faAudio').removeClass('fa-volume-up');
      $('#faAudio').addClass('fa-volume-off');
      audio = 'off';
    } else {
      $('#faAudio').removeClass('fa-volume-off');
      $('#faAudio').addClass('fa-volume-up');
      audio = 'on';
    }
    e.preventDefault();
    this.props.onAudioClick(audio);
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        { type: "button", id: "btnAudio", className: "button primary small", onClick: this.onAudioClick, style: { height: '2rem', width: '2rem' } },
        React.createElement("i", { id: "faAudio", className: "fa fa-volume-off" }),
        " "
      )
    );
  }
});

// Main component to hold child components
var Main = React.createClass({
  displayName: "Main",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(NavBar, null),
      React.createElement(Pomodoro, null)
    );
  }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('app'));