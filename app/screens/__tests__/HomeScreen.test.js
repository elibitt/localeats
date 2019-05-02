import React from 'react';
import renderer from 'react-test-renderer';

import HomeScreen from '../HomeScreen';

describe('Create home screen', () => {
  it('correctly renders', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
