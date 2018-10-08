import React from 'react';
import { connect } from 'react-redux';
import { updateCounter } from 'Actions/counterActions';
const Home = (props) => (
    <div>
      <h2>Home</h2>
      <p>Counter: {props.count}</p>
      <button onClick={() => props.updateCounter(props.count)}>Increase Count</button>
    </div>
);

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state) {
  return {
     count: state.counter
};
}

/** 
*  Mapping the props for the desired dispatch actions
*/
const mapDispatchToProps = { 
  updateCounter
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);