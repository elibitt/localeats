import React from 'react';
import renderer from 'react-test-renderer';

import SignIn from '../SignIn';

describe('Create signin screen', () => {
  it('correctly renders', () => {
    const tree = renderer.create(<SignIn />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
