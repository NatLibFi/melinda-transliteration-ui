/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-cyrillux
*
* melinda-cyrillux program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-cyrillux is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../../styles/components/record-id-input.scss';

export class RecordIdInput extends React.Component {

  static propTypes = {
    recordId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  handleChange(event) {
    if (!this.props.disabled) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    const labelClasses = classNames({
      active: this.props.recordId && this.props.recordId.length > 0
    });
    const recordId = this.props.recordId || '';
    
    return (
      <div className="input-field record-id">
        <label htmlFor="record-id-input" className={labelClasses}>Tietueen id</label>
        <input type="text" id="record-id-input" value={recordId} disabled={this.props.disabled} onChange={(e) => this.handleChange(e)}/>
      </div>
    );
  }
}