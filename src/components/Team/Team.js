import React from "react";

function Team(props) {
  return (
    <div>
      <h2>Team {props.number}</h2>
      <div>{props.childen}</div>
    </div>
  );
}
export default Team;
