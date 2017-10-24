/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-transliteration-ui
*
* melinda-transliteration-ui program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-transliteration-ui is distributed in the hope that it will be useful,
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
import '../../styles/components/navbar.scss';

export class NavBar extends React.Component {

  static propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    appTitle: React.PropTypes.string.isRequired,
    username: React.PropTypes.string
  }

  componentDidMount() {
    const navigationDropdownEl = this._dropdown;
    
    window.$(navigationDropdownEl).dropdown({
      inDuration: 150,
      outDuration: 150,
      constrain_width: false,
      hover: false,
      gutter: 0,
      belowOrigin: true,
      alignment: 'left'
    });
    
  }

  preventDefault(e) {
    e.preventDefault();
  }
  onLogout(e) {
    e.preventDefault(); 
    this.props.onLogout();
  }

  render() {
    const { username, appTitle } = this.props;

    return (
      <div className="navbar">
        <nav> 
          <div className="nav-wrapper">
            <ul id="nav" className="left">
              <li className="heading">{appTitle}</li>
            </ul>        
            <ul id="nav" className="right">
              <li>
                <a className="nav-dropdown" href="#" data-activates="mainmenu" ref={(c) => this._dropdown = c} onClick={this.preventDefault}>
                  <i className="material-icons right">more_vert</i>{username ? username : ''}
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <ul id='mainmenu' className='dropdown-content'>
          <li><a href="https://www.kiwi.fi/display/melinda/Kyrilliikan+translitterointi+Cyrillux-ohjelmalla" target="_blank">Ohjeet</a></li>
          <li className="divider" />
          <li><a href="#" onClick={(e) => this.onLogout(e)}>Kirjaudu ulos</a></li>
        </ul>
      </div>
    );
  }
} 
