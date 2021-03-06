import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import KeyCode from 'rc-util/lib/KeyCode';
import placements from './picker/placements';
import Trigger from 'rc-trigger';

function noop() {
}

function refFn(field, component) {
  this[field] = component;
}

const Picker = React.createClass({
  propTypes: {
    animation: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    disabled: PropTypes.bool,
    transitionName: PropTypes.string,
    onChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    children: PropTypes.func,
    getCalendarContainer: PropTypes.func,
    calendar: PropTypes.element,
    style: PropTypes.object,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    prefixCls: PropTypes.string,
    placement: PropTypes.any,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    align: PropTypes.object,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-calendar-picker',
      style: {},
      align: {},
      placement: 'bottomLeft',
      defaultOpen: false,
      onChange: noop,
      onOpen: noop,
      onClose: noop,
    };
  },

  getInitialState() {
    const props = this.props;
    let open;
    if ('open' in props) {
      open = props.open;
    } else {
      open = props.defaultOpen;
    }
    const value = props.value || props.defaultValue;
    this.saveCalendarRef = refFn.bind(this, 'calendarInstance');
    return {
      open,
      value,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { value, open } = nextProps;
    if ('value' in nextProps) {
      this.setState({
        value,
      });
    }
    if (open !== undefined) {
      this.setState({
        open,
      });
    }
  },

  onCalendarKeyDown(event) {
    if (event.keyCode === KeyCode.ESC) {
      event.stopPropagation();
      this.close(this.focus);
    }
  },

  onCalendarSelect(value, cause = {}) {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({
        value,
      });
    }
    if (
      cause.source === 'keyboard' ||
      (!props.calendar.props.timePicker && cause.source !== 'dateInput') ||
      cause.source === 'todayButton') {
      this.close(this.focus);
    }
    props.onChange(value);
  },

  onKeyDown(event) {
    if (event.keyCode === KeyCode.DOWN && !this.state.open) {
      this.open(this.focusCalendar);
      event.preventDefault();
    }
  },

  onCalendarOk() {
    this.close(this.focus);
  },

  onCalendarClear() {
    this.close(this.focus);
  },

  onVisibleChange(open) {
    this.setOpen(open, this.focusCalendar);
  },

  getCalendarElement() {
    const props = this.props;
    const state = this.state;
    const calendarProp = props.calendar;
    const { value } = state;
    let defaultValue;
    // RangeCalendar
    if (Array.isArray(value)) {
      defaultValue = value[0];
    } else {
      defaultValue = value;
    }
    const extraProps = {
      ref: this.saveCalendarRef,
      defaultValue: defaultValue || calendarProp.props.defaultValue,
      defaultSelectedValue: value,
      onKeyDown: this.onCalendarKeyDown,
      onOk: createChainedFunction(calendarProp.props.onOk, this.onCalendarOk),
      onSelect: createChainedFunction(calendarProp.props.onSelect, this.onCalendarSelect),
      onClear: createChainedFunction(calendarProp.props.onClear, this.onCalendarClear),
    };

    return React.cloneElement(calendarProp, extraProps);
  },

  setOpen(open, callback) {
    const { onOpen, onClose } = this.props;
    if (this.state.open !== open) {
      this.setState({
        open,
      }, callback);
      const event = {
        open,
      };
      if (open) {
        onOpen(event);
      } else {
        onClose(event);
      }
    }
  },

  open(callback) {
    this.setOpen(true, callback);
  },

  close(callback) {
    this.setOpen(false, callback);
  },

  focus() {
    if (!this.state.open) {
      ReactDOM.findDOMNode(this).focus();
    }
  },

  focusCalendar() {
    if (this.state.open) {
      this.calendarInstance.focus();
    }
  },

  render() {
    const props = this.props;
    const {
      prefixCls, placement,
      style, getCalendarContainer,
      align, animation,
      disabled,
      transitionName, children,
    } = props;
    const state = this.state;
    return (<Trigger
      popup={this.getCalendarElement()}
      popupAlign={align}
      builtinPlacements={placements}
      popupPlacement={placement}
      action={(disabled && !state.open) ? [] : ['click']}
      destroyPopupOnHide
      getPopupContainer={getCalendarContainer}
      popupStyle={style}
      popupAnimation={animation}
      popupTransitionName={transitionName}
      popupVisible={state.open}
      onPopupVisibleChange={this.onVisibleChange}
      prefixCls={prefixCls}
    >
      {React.cloneElement(children(state, props), { onKeyDown: this.onKeyDown })}
    </Trigger>);
  },
});

export default Picker;
