import React, { ReactNode } from 'react'
import { Box, Color } from 'ink'
import { render } from 'ink-testing-library'
import PropTypes from 'prop-types'

import Table, { Header, Skeleton, Cell } from '../'

// Helpers -------------------------------------------------------------------

const s = (v: string) => (
  <Box flexDirection="row">
    <Skeleton>{v}</Skeleton>
  </Box>
)
const e = (v: string) => (
  <Box flexDirection="row">
    <Header>{v}</Header>
  </Box>
)
const c = (v: string) => (
  <Box flexDirection="row">
    <Cell>{v}</Cell>
  </Box>
)

const Custom = ({ children }: { children: ReactNode }) => (
  <Color red italic>
    {children}
  </Color>
)
Custom.propTypes = {
  children: PropTypes.any.isRequired,
}

const u = (v: string) => (
  <Box flexDirection="row">
    <Custom>{v}</Custom>
  </Box>
)

// Tests ---------------------------------------------------------------------

describe('ink-table', () => {
  it('renders a table.', () => {
    const data = [{ name: 'Foo' }]
    const { lastFrame: actual } = render(<Table data={data} />)
    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e(' name ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Foo  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┘')}
        </Box>
      </>,
    )
    const act = actual()
    const exp = expected()
    console.log(act)
    console.log(exp)
    expect(act).toEqual(exp)
  })

  it('renders a table with numbers.', () => {
    const data = [{ name: 'Foo', age: 12 }]
    const { lastFrame: actual } = render(<Table data={data} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┬')}
          {s('─────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e(' name ')}
          {s('│')}
          {e(' age ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Foo  ')}
          {s('│')}
          {c(' 12  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┴')}
          {s('─────')}
          {s('┘')}
        </Box>
      </>,
    )

    const act = actual()
    const exp = expected()
    console.log(act)
    console.log(exp)
    expect(act).toEqual(exp)
  })

  it('renders a table with multiple rows.', () => {
    const data = [
      { name: 'Foo', age: 12 },
      { name: 'Bar', age: 15 },
    ]
    const { lastFrame: actual } = render(<Table data={data} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┬')}
          {s('─────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e(' name ')}
          {s('│')}
          {e(' age ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Foo  ')}
          {s('│')}
          {c(' 12  ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Bar  ')}
          {s('│')}
          {c(' 15  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┴')}
          {s('─────')}
          {s('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })

  it('renders table with undefined value.', () => {
    const data = [{ name: 'Foo' }, { name: 'Bar', age: 15 }]
    const { lastFrame: actual } = render(<Table data={data} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┬')}
          {s('─────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e(' name ')}
          {s('│')}
          {e(' age ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Foo  ')}
          {s('│')}
          {c('     ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Bar  ')}
          {s('│')}
          {c(' 15  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┴')}
          {s('─────')}
          {s('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })

  it('renders a table with custom padding.', () => {
    const data = [
      { name: 'Foo', age: 12 },
      { name: 'Bar', age: 15 },
    ]
    const { lastFrame: actual } = render(<Table data={data} padding={3} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────────')}
          {s('┬')}
          {s('─────────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e('   name   ')}
          {s('│')}
          {e('   age   ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────────')}
          {s('┼')}
          {s('─────────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c('   Foo    ')}
          {s('│')}
          {c('   12    ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────────')}
          {s('┼')}
          {s('─────────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c('   Bar    ')}
          {s('│')}
          {c('   15    ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────────')}
          {s('┴')}
          {s('─────────')}
          {s('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })

  it('renders a table with custom header.', () => {
    const data = [
      { name: 'Foo', age: 12 },
      { name: 'Bar', age: 15 },
    ]
    const { lastFrame: actual } = render(<Table data={data} header={Custom} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┬')}
          {s('─────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {u(' name ')}
          {s('│')}
          {u(' age ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Foo  ')}
          {s('│')}
          {c(' 12  ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {c(' Bar  ')}
          {s('│')}
          {c(' 15  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┴')}
          {s('─────')}
          {s('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })

  it('renders a table with custom cell.', () => {
    const data = [
      { name: 'Foo', age: 12 },
      { name: 'Bar', age: 15 },
    ]
    const { lastFrame: actual } = render(<Table data={data} cell={Custom} />)

    const { lastFrame: expected } = render(
      <>
        <Box>
          {s('┌')}
          {s('──────')}
          {s('┬')}
          {s('─────')}
          {s('┐')}
        </Box>
        <Box>
          {s('│')}
          {e(' name ')}
          {s('│')}
          {e(' age ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {u(' Foo  ')}
          {s('│')}
          {u(' 12  ')}
          {s('│')}
        </Box>
        <Box>
          {s('├')}
          {s('──────')}
          {s('┼')}
          {s('─────')}
          {s('┤')}
        </Box>
        <Box>
          {s('│')}
          {u(' Bar  ')}
          {s('│')}
          {u(' 15  ')}
          {s('│')}
        </Box>
        <Box>
          {s('└')}
          {s('──────')}
          {s('┴')}
          {s('─────')}
          {s('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })

  it('renders a table with custom skeleton.', () => {
    const data = [
      { name: 'Foo', age: 12 },
      { name: 'Bar', age: 15 },
    ]
    const { lastFrame: actual } = render(
      <Table data={data} skeleton={Custom} />,
    )

    const { lastFrame: expected } = render(
      <>
        <Box>
          {u('┌')}
          {u('──────')}
          {u('┬')}
          {u('─────')}
          {u('┐')}
        </Box>
        <Box>
          {u('│')}
          {e(' name ')}
          {u('│')}
          {e(' age ')}
          {u('│')}
        </Box>
        <Box>
          {u('├')}
          {u('──────')}
          {u('┼')}
          {u('─────')}
          {u('┤')}
        </Box>
        <Box>
          {u('│')}
          {c(' Foo  ')}
          {u('│')}
          {c(' 12  ')}
          {u('│')}
        </Box>
        <Box>
          {u('├')}
          {u('──────')}
          {u('┼')}
          {u('─────')}
          {u('┤')}
        </Box>
        <Box>
          {u('│')}
          {c(' Bar  ')}
          {u('│')}
          {c(' 15  ')}
          {u('│')}
        </Box>
        <Box>
          {u('└')}
          {u('──────')}
          {u('┴')}
          {u('─────')}
          {u('┘')}
        </Box>
      </>,
    )

    expect(actual()).toEqual(expected())
  })
})

// ---------------------------------------------------------------------------
