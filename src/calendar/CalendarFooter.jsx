import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import toFragment from 'rc-util/lib/Children/mapSelf';
import cx from 'classnames';
import TodayButton from '../calendar/TodayButton';
import OkButton from '../calendar/OkButton';
import TimePickerButton from '../calendar/TimePickerButton';

const CalendarFooter = React.createClass({
  propTypes: {
    prefixCls: PropTypes.string,
    showDateInput: PropTypes.bool,
    disabledTime: PropTypes.any,
    timePicker: PropTypes.element,
    gregorianCalendarLocale: PropTypes.object,
    selectedValue: PropTypes.any,
    showOk: PropTypes.bool,
    onSelect: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
  },

  onSelect(value) {
    this.props.onSelect(value);
  },

  getRootDOMNode() {
    return ReactDOM.findDOMNode(this);
  },

  render() {
    const props = this.props;
    const { value, prefixCls, showOk, timePicker } = props;
    let footerEl = null;
    if (props.showToday || timePicker) {
      let nowEl;
      if (props.showToday) {
        nowEl = <TodayButton {...props} value={value}/>;
      }
      let okBtn;
      if (showOk === true || showOk !== false && !!props.timePicker) {
        okBtn = <OkButton {...props}/>;
      }
      let timePickerBtn;
      if (!!props.timePicker) {
        timePickerBtn = <TimePickerButton {...props} />;
      }

      let footerBtn;
      if (nowEl || okBtn) {
        footerBtn = (<span className={`${prefixCls}-footer-btn`}>
          {toFragment([nowEl, timePickerBtn, okBtn])}
        </span>);
      }
      const cls = cx({
        [`${prefixCls}-footer`]: true,
        [`${prefixCls}-footer-show-ok`]: okBtn,
      });
      footerEl = (
        <div className={cls}>
          {footerBtn}
        </div>);
    }
    return footerEl;
  },
});

export default CalendarFooter;
