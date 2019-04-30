import React from 'react';
import renderer from 'react-test-renderer';

import CreateScreen from '../CreateScreen';

describe('Create meal screen', () => {
  it('correctly renders', () => {
    const tree = renderer.create(<CreateScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
