import React from 'react';
import renderer from 'react-test-renderer';

import SignUp from '../SignUp';

describe('Create signup screen', () => {
  it('correctly renders', () => {
    const tree = renderer.create(<SignUp />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
