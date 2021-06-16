import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders hello world', () => {
  render(<Home />);
  const helloWorldElement = screen.getByText(/hello world/i);
  expect(helloWorldElement).toBeInTheDocument();
});
