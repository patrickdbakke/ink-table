import * as React from 'react'
import { Box, Color } from 'ink'
import { Dictionary } from './utils'

interface TableProps<T> {
  data: Array<Dictionary<T | string>>
  headers?: Dictionary<T | string>
  padding?: number
  header?: React.ComponentType<{ children: string }>
  cell?: React.ComponentType<{ children: string }>
  skeleton?: React.ComponentClass<{ children: string }>
  characters: FrameCharacters
}
interface FrameCharacters {
  ' ': string
  '─': string
  '│': string
  '┼': string
  '┌': string
  '┐': string
  '└': string
  '┘': string
  '┬': string
  '┴': string
  '├': string
  '┤': string
}
interface RowProps<T> {
  data: Dictionary<T>
  keys: string[]
  widths: Dictionary<number>

  kind?: 'top' | 'header' | 'mid' | 'bottom' | 'row'
  padding?: number
  header?: React.ComponentType<{ children: string }>
  cell?: React.ComponentType<{ children: string }>
  skeleton?: React.ComponentClass<{ children: string }>
  characters?: FrameCharacters
}
type FrameCharacter = keyof FrameCharacters

const Cell: React.FC = ({ children, ...props }) => {
  return <Color {...props}>{children}</Color>
}
const Skeleton: React.FC = ({ children }) => {
  return (
    <Color white bold>
      {children}
    </Color>
  )
}
const Header: React.FC = ({ children }) => {
  return (
    <Color blue bold>
      {children}
    </Color>
  )
}
const defaultProps = {
  padding: 1,
  header: Header,
  cell: Cell,
  skeleton: Skeleton,
  characters: {
    ' ': ' ',
    '─': '─',
    '│': '│',
    '┼': '┼',
    '┌': '┌',
    '┐': '┐',
    '└': '└',
    '┘': '┘',
    '┬': '┬',
    '┴': '┴',
    '├': '├',
    '┤': '┤',
  },
}
const stringOf = (s: string, n: number) => new Array(n).fill(s).join('')

// const Row: React.FC<RowProps<T>> = ({
const Row: any = ({
  kind = 'row',
  data = {},
  keys = [],
  widths = {},
  characters = defaultProps.characters,
  padding = 1,
  skeleton = Skeleton,
  header = Header,
  cell = Cell,
  ...rest
}) => {
  const S = skeleton,
    C = cell,
    H = header
  let CellType: any,
    left: FrameCharacter,
    line: FrameCharacter,
    divider: FrameCharacter,
    right: FrameCharacter

  switch (kind) {
    case 'top':
      CellType = S
      left = '┌'
      line = '─'
      divider = '┬'
      right = '┐'
      break
    case 'header':
      CellType = H
      left = '│'
      line = ' '
      divider = '│'
      right = '│'
      break
    case 'mid':
      CellType = S
      left = '├'
      line = '─'
      divider = '┼'
      right = '┤'
      break
    case 'bottom':
      CellType = S
      left = '└'
      line = '─'
      divider = '┴'
      right = '┘'
      break
    case 'row':
      CellType = C
      left = '│'
      line = ' '
      divider = '│'
      right = '│'
      break
  }

  let totalWidth = 3
  const padd = stringOf(characters[line], padding)
  const Middle = keys.map((key, i) => {
    const width = widths[key]
    totalWidth += width + padding * 2
    let text
    if (data[key] === undefined) {
      text = stringOf(characters[line], width)
    } else {
      text = String(data[key]) + stringOf(' ', width - String(data[key]).length)
    }
    const rows = [
      <Box flexDirection="row">
        <CellType padding={padding} key={i}>
          {padd}
          {text}
          {padd}
        </CellType>
      </Box>,
    ]
    if (i < keys.length - 1) {
      rows.push(
        <Box flexDirection="row">
          <S>{characters[divider]}</S>
        </Box>,
      )
    }
    return rows
  })

  return (
    <Box flexDirection="row" {...rest} width={totalWidth}>
      <Box flexDirection="row">
        <S>{characters[left]}</S>
      </Box>
      {Middle}
      <Box flexDirection="row">
        <S>{characters[right]}</S>
      </Box>
    </Box>
  )
}

export class Table<T> extends React.Component<TableProps<T>> {
  private currentX = 0
  private currentY = 0
  static defaultProps = defaultProps

  /**
   * Rendering of the Table.
   */
  render() {
    const { data, padding, headers = {}, skeleton, header, cell } = this.props
    const keys = []
    for (let datum of data) {
      const datumKeys = Object.keys(datum)
      for (let j = 0; j < datumKeys.length; j++) {
        if (keys.indexOf(datumKeys[j]) < 0) {
          keys.push(datumKeys[j])
        }
      }
    }

    const headerRow: Dictionary<T> = {}
    const emptyRow: Dictionary<T> = {}
    const widths = {}
    for (let key of keys) {
      const vals = data.map(d => d[key] || '')
      const lengths = vals.map((c: unknown) => c.toString().length)
      const max = Math.max(...lengths, key.length)
      widths[key] = max
      headerRow[key] = headers[key] || key
    }

    const props = {
      keys,
      widths,
      padding,
      skeleton,
      header,
      cell,
    }
    return (
      <>
        <Row kind="top" data={emptyRow} {...props} />
        <Row kind="header" data={headerRow} {...props} />
        <Row kind="mid" data={emptyRow} {...props} />
        {data.map((row, i) => {
          const rows = []
          rows.push(<Row kind="row" data={row} {...props} />)
          if (i < data.length - 1) {
            rows.push(<Row kind="mid" data={emptyRow} {...props} />)
          }
          return rows
        })}
        <Row kind="bottom" data={emptyRow} {...props} />
      </>
    )
  }
}

export default Table
export { Header, Cell, Skeleton }
