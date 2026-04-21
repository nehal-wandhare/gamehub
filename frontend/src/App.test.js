import { render, screen } from '@testing-library/react';
import App from './App';

// ✅ mock socket
jest.mock('socket.io-client', () => {
  return () => ({
    on: jest.fn(),
    emit: jest.fn(),
  });
});

test('renders GameHub title', () => {
  render(<App />);
  expect(screen.getByText(/gamehub click battle/i)).toBeInTheDocument();
});

test('renders input field', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
});

test('renders start button', () => {
  render(<App />);
  expect(screen.getByText(/start game/i)).toBeInTheDocument();
});

test('renders leaderboard section', () => {
  render(<App />);
  expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
});
