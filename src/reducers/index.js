// import { combineReducers } from 'redux';
import _ from 'underscore';
import {
  FanFilters,
  UserFilters,
  SET_FAN_FILTER,
  RUN_FAN_FILTER,
  ADD_FAN_SOURCE,
  SELECT_FAN,
  CLEAR_SELECTED_FANS,
  SET_USER_FILTER,
  RUN_USER_FILTER,
} from '../actions';
import NumbersHelper from '../helpers/Numbers';

const initialState = {
  fans: {
    shown: [],
    sources: [],
    sourceLocations: [],
    selected: [],
  },
  filters: {
    fanFilter: FanFilters.SHOW_ALL,
    location: null,
    distance: null,
    followers: null,
    sentiment: null,
  },
  user: {
    stats: {
      twitter: {
        following: 0,
        followers: 0,
        engagementRate: 0,
      },
    },
  },
};

function measureFanInfluence(fan, maxInfluence) {
  const thisFan = fan;
  thisFan.influence = Math.round(
    ((fan.influence || fan.interactions) * 100) / maxInfluence,
  );
  if (Number.isNaN(thisFan.influence)) {
    thisFan.influence = 1;
  }
  return thisFan;
}

function fans(state = {}, action) {
  // console.log(action);
  switch (action.type) {
    case ADD_FAN_SOURCE: {
      const fanSourceIndex = state.sourceLocations.indexOf(action.source);

      // Add Influnce Scores
      const maxInfluence = fans[0]
        ? fans[0].influence || fans[0].interactions
        : 1;
      const interactionFans = action.fans.map(fan =>
        measureFanInfluence(fan, maxInfluence),
      );

      // Add statistics
      const statisticsFans = interactionFans.map((fan, index) => {
        const DEFAULT_SENTIMENT = ['positive', 'negative', 'neutral'];
        const DEFAULT_PERCENTAGES = ['100%', '80%', '60%', '40%', '9%', '0%'];
        const newFan = fan;

        newFan.stats = {
          engagement:
            fan.engagement ||
            DEFAULT_PERCENTAGES[
              Math.floor(Math.random() * DEFAULT_PERCENTAGES.length)
            ],
          influence:
            fan.influence ||
            DEFAULT_PERCENTAGES[
              Math.floor(Math.random() * DEFAULT_PERCENTAGES.length)
            ],
          sentiment:
            fan.sentiment ||
            DEFAULT_SENTIMENT[
              Math.floor(Math.random() * DEFAULT_SENTIMENT.length)
            ],
          followers: NumbersHelper.makeNumberHumanReadable(
            fan.followers_count || Math.floor(Math.random() * 739000),
          ),
          // don't bother asking why these are x2, you'll cry, guarenteed. -CENG
          following: NumbersHelper.makeNumberHumanReadable(
            fan.friends_count * 20 || Math.floor(Math.random() * 400000),
          ),
          tweets: NumbersHelper.makeNumberHumanReadable(
            fan.statuses_count * 2 || Math.floor(Math.random() * 52000),
          ),
          index: index.toString(),
        };

        return newFan;
      });

      if (fanSourceIndex < 0) {
        return {
          ...state,
          sourceLocations: [...state.sourceLocations, action.source],
          sources: [...state.sources, statisticsFans],
        };
      }

      const newSources = state.sources;
      newSources[fanSourceIndex] = statisticsFans;

      return {
        ...state,
        sources: newSources,
      };
    }
    case SELECT_FAN: {
      const selectedFans = state.selected;
      if (selectedFans.indexOf(action.username) > -1) {
        selectedFans.splice(selectedFans.indexOf(action.username), 1);
      } else {
        selectedFans.push(action.username);
      }
      return {
        ...state,
        selected: selectedFans,
      };
    }
    case CLEAR_SELECTED_FANS:
      return {
        ...state,
        selected: [],
      };
    default:
      return state;
  }
}

function filters(state = {}, action) {
  switch (action.type) {
    case SET_FAN_FILTER:
      return {
        ...state,
        fanFilter: action.filter,
      };
    case SET_USER_FILTER: {
      let filterName = '';
      if (action.filter === UserFilters.CHANGE_DISTANCE) {
        filterName = 'distance';
      } else if (action.filter === UserFilters.CHANGE_FOLLOWERS) {
        filterName = 'followers';
      } else if (action.filter === UserFilters.CHANGE_LOCATION) {
        filterName = 'location';
      } else if (action.filter === UserFilters.CHANGE_SENTIMENT) {
        filterName = 'sentiment';
      } else {
        return state;
      }
      const newState = state;
      newState[filterName] = action.value;
      return newState;
    }
    default:
      return state;
  }
}

function runFanFilter(filter, fansObj) {
  function fixedRandom(username) {
    // FIXME: This shouldn't be necessary once the data is all in place
    let total = 0;
    for (let i = 0, j = username.length; i < j; i += 1) {
      total += username.charCodeAt(i);
    }
    return total;
  }
  function filterFans(attributeName, threshold = 0.5) {
    const newFans = [];
    fansObj.sources.map(source =>
      source.map(fan => {
        const newFan = fan;
        // FIXME : probably could do better than random
        newFan[attributeName] = fan[attributeName] || fixedRandom(fan.username);
        if (newFan[attributeName] >= threshold) {
          newFans.push(newFan);
        }
        return fan;
      }),
    );
    return newFans;
  }

  switch (filter) {
    case FanFilters.SHOW_ENGAGED: {
      return filterFans('engagement', 1400);
    }
    case FanFilters.SHOW_INFLUENTIAL: {
      return filterFans('influence', 5000000);
    }
    case FanFilters.SHOW_TRENDING: {
      return filterFans('trending', 1600);
    }
    case FanFilters.SHOW_ALL:
    default:
      return _.union(...fansObj.sources);
  }
}

function runUserFilter(filtersObj, fansObj) {
  const { location, distance, followers, sentiment } = filtersObj;
  const { sources } = fansObj;

  function matchedFanLocation(fan) {
    // FIXME: Data doesn't exist
    // console.log('LOCATION FILTER');
    // console.log(fan.location);
    // console.log(location);
    if (
      location === null ||
      fan.location === undefined ||
      fan.location === location
    ) {
      return true;
    }
    return false;
  }
  function matchedFanDistance(fan) {
    // FIXME: Data doesn't exist
    // console.log('DISTANCE FILTER');
    // console.log(fan.distance);
    // console.log(distance);
    if (
      distance === null ||
      fan.distance === undefined ||
      fan.distance === distance
    ) {
      return true;
    }
    return false;
  }
  function matchedFanFollowers(fan) {
    // console.log('FOLLOWERS FILTER');
    // console.log(fan.followers);
    // console.log(followers);
    if (
      followers === null ||
      fan.followers === undefined ||
      NumbersHelper.makeNumberComputerReadable(fan.followers) >= followers
    ) {
      return true;
    }
    return false;
  }
  function matchedFanSentiment(fan) {
    // console.log('SENTIMENT FILTER');
    // console.log(fan.sentiment);
    // console.log(sentiment);
    // console.log(fan.sentiment === sentiment);
    if (
      sentiment === null ||
      fan.sentiment === undefined ||
      fan.sentiment === sentiment
    ) {
      return true;
    }
    return false;
  }

  // console.log(location, distance, followers, sentiment);
  // console.log(sources);
  // FIXME : How do these values relate to the data given for a fan?

  const fansWhoMatchCriteria = [];
  sources.map(source => {
    source.map(fan => {
      // console.log(fan);
      if (
        (location === null || matchedFanLocation(fan.stats)) &&
        (distance === null || matchedFanDistance(fan.stats)) &&
        (followers === null || matchedFanFollowers(fan.stats)) &&
        (sentiment === null || matchedFanSentiment(fan.stats))
      ) {
        fansWhoMatchCriteria.push(fan);
      }
      return fansWhoMatchCriteria;
    });
    return fansWhoMatchCriteria;
  });
  return fansWhoMatchCriteria;
}

function truFan(state = initialState, action) {
  switch (action.type) {
    case SET_USER_FILTER:
    case SET_FAN_FILTER: {
      const newState = {
        filters: filters(state.filters, action),
      };
      return { ...state, ...newState };
    }
    case RUN_FAN_FILTER: {
      const newState = {
        fans: {
          ...state.fans,
          shown: runFanFilter(state.filters.fanFilter, state.fans),
        },
      };
      return { ...state, ...newState };
    }
    case RUN_USER_FILTER: {
      const newState = {
        fans: {
          ...state.fans,
          shown: runUserFilter(state.filters, state.fans),
        },
      };
      return { ...state, ...newState };
    }
    case SELECT_FAN:
    case CLEAR_SELECTED_FANS:
    case ADD_FAN_SOURCE: {
      const newState = {
        fans: fans(state.fans, action),
      };
      return { ...state, ...newState };
    }
    default:
      return state;
  }
}

// const truFanApp = combineReducers({
//   filters,
// });

export default truFan;
