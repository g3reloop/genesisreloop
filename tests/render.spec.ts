import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Home from '../app/page'

describe('Home page', () => {
  it('renders hero and buttons', () => {
    const { getByText } = render(Home({}))
    expect(getByText('Genesis ReLoop')).toBeTruthy()
    expect(getByText('Enter Marketplace')).toBeTruthy()
  })
})
