import { endent, property } from '@dword-design/functions'
import postcss from 'postcss'

import plugin from '.'

export default {
  'other properties': async () => {
    const processor = postcss([plugin])
    const css =
      processor.process('a { background: red; link-area: stretch }')
      |> await
      |> property('css')
    expect(css).toEqual(
      "a { background: red }a:after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 1; pointer-events: auto; background-color: rgba(0,0,0,0) }"
    )
  },
  valid: async () => {
    const processor = postcss([plugin])
    const css =
      processor.process('a { link-area: stretch }') |> await |> property('css')
    expect(css).toEqual(endent`
      a:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          pointer-events: auto;
          background-color: rgba(0,0,0,0) }
    `)
  },
}
