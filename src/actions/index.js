/* Action Types */
export const SET_FAN_FILTER = 'SET_FAN_FILTER';
export const RUN_FAN_FILTER = 'RUN_FAN_FILTER';
export const ADD_FAN_SOURCE = 'ADD_FAN_SOURCE';
export const SELECT_FAN = 'SELECT_FAN';
export const CLEAR_SELECTED_FANS = 'CLEAR_SELECTED_FANS';
export const SET_USER_FILTER = 'UPDATE_USER_FILTER';
export const RUN_USER_FILTER = 'RUN_USER_FILTER';

/* Action Groups */
export const FanFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_ENGAGED: 'SHOW_ENGAGED',
  SHOW_INFLUENTIAL: 'SHOW_INFLUENTIAL',
  SHOW_TRENDING: 'SHOW_TRENDING',
};

export const UserFilters = {
  CHANGE_LOCATION: 'CHANGE_LOCATION',
  CHANGE_DISTANCE: 'CHANGE_DISTANCE',
  CHANGE_FOLLOWERS: 'CHANGE_FOLLOWERS',
  CHANGE_SENTIMENT: 'CHANGE_SENTIMENT',
};

/* Action Creators */
export function setFanFilter(filter) {
  return {
    type: SET_FAN_FILTER,
    filter,
  };
}

export function runFanFilter(filter) {
  return {
    type: RUN_FAN_FILTER,
    filter,
  };
}

export function addFanSource(fans, source) {
  return {
    type: ADD_FAN_SOURCE,
    fans,
    source,
  };
}

export function selectFan(username) {
  return {
    type: SELECT_FAN,
    username,
  };
}

export function clearSelectedFans() {
  return {
    type: CLEAR_SELECTED_FANS,
  };
}

export function setUserFilter(filter, value) {
  return {
    type: SET_USER_FILTER,
    filter,
    value,
  };
}

export function runUserFilter() {
  return {
    type: RUN_USER_FILTER,
  };
}
