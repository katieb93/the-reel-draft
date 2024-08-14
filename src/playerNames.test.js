import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerNames from './playerNames';

describe('PlayerNames Component', () => {
  const formData = { players: '3' }; // Example formData with 3 players
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear(); // Clear any previous calls to onSubmit
  });

  test('renders the component with initial state', () => {
    render(<PlayerNames formData={formData} onSubmit={onSubmit} />);

    expect(screen.getByText('Who is playing?')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Player \d+/)).toHaveLength(3);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('updates player names on input change', () => {
    render(<PlayerNames formData={formData} onSubmit={onSubmit} />);

    const inputElements = screen.getAllByPlaceholderText(/Player \d+/);
    fireEvent.change(inputElements[0], { target: { value: 'Alice' } });
    fireEvent.change(inputElements[1], { target: { value: 'Bob' } });
    fireEvent.change(inputElements[2], { target: { value: 'Charlie' } });

    expect(inputElements[0].value).toBe('Alice');
    expect(inputElements[1].value).toBe('Bob');
    expect(inputElements[2].value).toBe('Charlie');
  });

  test('shows popup for empty names on submit', () => {
    render(<PlayerNames formData={formData} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText('Please fill out all player names before submitting')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows popup for duplicate names on submit', () => {
    render(<PlayerNames formData={formData} onSubmit={onSubmit} />);

    const inputElements = screen.getAllByPlaceholderText(/Player \d+/);
    fireEvent.change(inputElements[0], { target: { value: 'Alice' } });
    fireEvent.change(inputElements[1], { target: { value: 'Alice' } });
    fireEvent.change(inputElements[2], { target: { value: 'Charlie' } });

    fireEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText('Player names cannot be identical')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid player names', () => {
    render(<PlayerNames formData={formData} onSubmit={onSubmit} />);

    const inputElements = screen.getAllByPlaceholderText(/Player \d+/);
    fireEvent.change(inputElements[0], { target: { value: 'Alice' } });
    fireEvent.change(inputElements[1], { target: { value: 'Bob' } });
    fireEvent.change(inputElements[2], { target: { value: 'Charlie' } });

    fireEvent.click(screen.getByText('Confirm'));

    expect(onSubmit).toHaveBeenCalledWith({
      formData: formData,
      playerNames: ['Alice', 'Bob', 'Charlie'],
    });
  });
});
