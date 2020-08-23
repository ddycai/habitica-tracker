import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Habitica Summary Tool', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Habitica Summary Tool/i);
  expect(linkElement).toBeInTheDocument();
});
