import React from 'react';
import renderer from 'react-test-renderer';

import ProfileScreen from '../ProfileScreen';

describe('Create profile screen', () => {
  it('correctly renders', () => {
    const tree = renderer.create(<ProfileScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
