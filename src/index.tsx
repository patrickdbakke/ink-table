import * as React from 'react'
import { Box, Color } from 'ink'
import { Dictionary } from './utils'

export interface TableProps<T> {
  data: Array<Dictionary<T | string>>
  headers?: Dictionary<T | string>
  padding?: number
  header?: React.ComponentType
  cell?: React.ComponentType
  skeleton?: React.ComponentType
  characters: FrameCharacters
}
export interface FrameCharacters {
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
type FrameCharacter = keyof FrameCharacters

const stringOf = (s: string, n: number) => new Array(n).fill(s).join('')

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

export class Table<T> extends React.Component<TableProps<T>> {
  private currentX = 0
  private currentY = 0
  private totalWidth: number
  private widthsByKey: Dictionary<number>
  private keys: string[]
  static defaultProps = defaultProps

  /**
   * Generates a line out of the provided cells.
   */
  getLine(
    type: 'top' | 'header' | 'mid' | 'bottom' | 'row',
    data: Dictionary<T | string>,
    key: string | number = '',
  ) {
    const { padding, characters } = this.props
    const S = this.props.skeleton
    const H = this.props.header
    const C = this.props.cell
    let CellType: any,
      left: FrameCharacter,
      line: FrameCharacter,
      divider: FrameCharacter,
      right: FrameCharacter

    switch (type) {
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

    const padd = stringOf(characters[line], padding)
    const Middle = this.keys.map((key, i) => {
      const width = this.widthsByKey[key]
      let text
      if (data[key] === undefined) {
        text = stringOf(characters[line], width)
      } else {
        text =
          String(data[key]) + stringOf(' ', width - String(data[key]).length)
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
      if (i < this.keys.length - 1) {
        rows.push(
          <Box flexDirection="row">
            <S>{characters[divider]}</S>
          </Box>,
        )
      }
      return rows
    })

    return (
      <>
        <Box flexDirection="row">
          <S>{characters[left]}</S>
        </Box>
        {Middle}
        <Box flexDirection="row">
          <S>{characters[right]}</S>
        </Box>
      </>
    )
  }

  /**
   * Rendering of the Table.
   */
  render() {
    const { data, padding, headers = {} } = this.props
    const keys = []
    for (let datum of data) {
      const datumKeys = Object.keys(datum)
      for (let j = 0; j < datumKeys.length; j++) {
        if (keys.indexOf(datumKeys[j]) < 0) {
          keys.push(datumKeys[j])
        }
      }
    }
    this.keys = keys

    const headerRow: Dictionary<T | string> = {}
    const emptyRow: Dictionary<T | string> = {}
    this.widthsByKey = {}
    for (let key of keys) {
      const vals = data.map(d => d[key] || '')
      const lengths = vals.map((c: unknown) => c.toString().length)
      const max = Math.max(...lengths, key.length)
      this.widthsByKey[key] = max
      this.totalWidth += max
      headerRow[key] = headers[key] || key
    }

    return (
      <>
        <Box flexDirection="row">{this.getLine('top', emptyRow, 1)}</Box>
        <Box flexDirection="row">{this.getLine('header', headerRow, 2)}</Box>
        <Box flexDirection="row">{this.getLine('mid', emptyRow, 3)}</Box>
        {data.map((row, i) => {
          const rows = [
            <Box flexDirection="row">
              {this.getLine('row', row, 4 + 2 * i)}
            </Box>,
          ]
          if (i < data.length - 1) {
            rows.push(
              <Box flexDirection="row">
                {this.getLine('mid', emptyRow, 4 + 2 * i + 1)}
              </Box>,
            )
          }
          return rows
        })}
        <Box flexDirection="row">{this.getLine('bottom', emptyRow, 0)}</Box>
      </>
    )
  }
}

export default Table
export { Header, Cell, Skeleton }
