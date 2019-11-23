import * as React from 'react'
import { Box, Color } from 'ink'
import { Dictionary } from './utils'

type HasWidth = {
  width: number
}
export interface TableProps<T> {
  data: Array<Dictionary<T | string>>
  headers?: Dictionary<T | string>
  padding?: number
  header?: React.ComponentType<{ children: string } & HasWidth>
  cell?: React.ComponentType<{ children: string } & HasWidth>
  skeleton?: React.ComponentClass<{ children: string } & HasWidth>
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

const stringOf = (s: string, n: number) => new Array(n).fill(s).join('')

type FrameCharacter = keyof FrameCharacters
const Skeleton: React.FC<HasWidth> = ({ width, children }) => {
  return (
    <Box width={width} flexDirection="row">
      <Color white bold>
        {children}
      </Color>
    </Box>
  )
}
const Header: React.FC<HasWidth> = ({ width, children }) => {
  return (
    <Box width={width} flexDirection="row">
      <Color blue bold>
        {children}
      </Color>
    </Box>
  )
}
const Cell: React.FC<HasWidth> = ({ width, children }) => {
  return (
    <Box width={width} flexDirection="row">
      <Color>{children}</Color>
    </Box>
  )
}

export class Table<T> extends React.Component<TableProps<T>> {
  private totalWidth: number
  private widthsByKey: Dictionary<number>
  private keys: string[]
  static defaultProps = {
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
    const Left = <S width={1}>{characters[left]}</S>
    const Divider = <S width={1}>{characters[divider]}</S>
    const Right = <S width={1}>{characters[right]}</S>
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
        <CellType padding={padding} width={width + padding * 2} key={i}>
          {padd}
          {text}
          {}
          {padd}
        </CellType>,
      ]
      if (i < this.keys.length - 1) {
        rows.push(Divider)
      }
      return rows
    })

    return (
      <Box width={this.totalWidth} flexDirection="row" key={key}>
        {Left}
        {Middle}
        {Right}
      </Box>
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
        {this.getLine('top', emptyRow, 1)}
        {this.getLine('header', headerRow, 2)}
        {this.getLine('mid', emptyRow, 3)}
        {data.map((row, i) => {
          const rows = [this.getLine('row', row, 4 + 2 * i)]
          if (i < data.length - 1) {
            rows.push(this.getLine('mid', emptyRow, 4 + 2 * i + 1))
          }
          return rows
        })}
        {this.getLine('bottom', emptyRow, 0)}
      </>
    )
  }
}

export default Table
export { Header, Cell, Skeleton }
