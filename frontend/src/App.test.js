import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app content', () => {
  render(<App />);

  // 👇 change this text according to your UI
  const element = screen.getByText(/game/i);

  expect(element).toBeInTheDocument();
});
