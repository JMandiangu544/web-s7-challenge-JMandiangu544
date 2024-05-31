import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Unit Tests for the sum function
describe('sum function', () => {
  test('throws an error when no arguments are provided', () => {
    expect(() => sum()).toThrow('pass valid numbers');
  });

  test('throws an error when a non-number argument is provided', () => {
    expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
  });

  test('returns the correct sum when valid numbers are provided', () => {
    expect(sum(1, 3)).toBe(4);
  });

  test('returns the correct sum when one argument is a string', () => {
    expect(sum('1', 2)).toBe(3);
  });

  test('returns the correct sum when both arguments are strings', () => {
    expect(sum('10', '3')).toBe(13);
  });
});

// Integration Tests for the HelloWorld component
describe('<HelloWorld />', () => {
  beforeEach(() => {
    render(<HelloWorld />);
  });

  test('renders a link that reads "Home"', () => {
    expect(screen.queryByText('Home')).toBeInTheDocument();
  });

  test('renders a link that reads "About"', () => {
    expect(screen.queryByText('About')).toBeInTheDocument();
  });

  test('renders a link that reads "Blog"', () => {
    expect(screen.queryByText('Blog')).toBeInTheDocument();
  });

  test('renders a text that reads "The Truth"', () => {
    expect(screen.queryByText('The Truth')).toBeInTheDocument();
  });

  test('renders a text that reads "JavaScript is pretty awesome"', () => {
    expect(screen.queryByText('JavaScript is pretty awesome')).toBeInTheDocument();
  });

  test('renders a text that includes "javaScript is pretty" (case insensitive)', () => {
    expect(screen.queryByText(/javaScript is pretty/i, { exact: false })).toBeInTheDocument();
  });
});

// Sum function implementation
function sum(a, b) {
  a = Number(a);
  b = Number(b);
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers');
  }
  return a + b;
}

// HelloWorld component implementation
function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  );
}
