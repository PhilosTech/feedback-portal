import React from 'react'
import App from './App'
import { mount } from 'cypress/react';

describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<App />)
  })
})