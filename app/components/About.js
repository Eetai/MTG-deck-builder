import React from 'react'
import SocialPeople from 'material-ui/svg-icons/social/people';
import SocialPerson from 'material-ui/svg-icons/social/person';

export default function About(props) {
  return (
    <div
      onClick={() => props.closeDialog()}
      style={{ display: 'flex', flexDirection: 'column' }}
      >
      <SocialPeople/>
      <SocialPerson/>
    </div>
  )
}
