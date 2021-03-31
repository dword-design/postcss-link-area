import { join, map } from '@dword-design/functions'
import postcss from 'postcss'

export default postcss.plugin('postcss-link-area', () => css => {
  css.walkDecls('link-area', decl => {
    if (decl.value !== 'stretch') {
      return
    }

    const origRule = decl.parent

    const ruleSelectors =
      origRule.selectors
      |> map(ruleSelector => `${ruleSelector}:after`)
      |> join(',\n')

    // Insert the :after rule before the original rule
    const newRule = origRule.cloneAfter({ selector: ruleSelectors }).removeAll()
    newRule.append(
      { prop: 'content', source: decl.source, value: "''" },
      { prop: 'position', source: decl.source, value: 'absolute' },
      { prop: 'top', source: decl.source, value: 0 },
      { prop: 'right', source: decl.source, value: 0 },
      { prop: 'bottom', source: decl.source, value: 0 },
      { prop: 'left', source: decl.source, value: 0 },
      { prop: 'z-index', source: decl.source, value: 1 },
      { prop: 'pointer-events', source: decl.source, value: 'auto' },
      { prop: 'background-color', source: decl.source, value: 'rgba(0,0,0,0)' }
    )
    // If the original rule only had clear:fix in it, remove the whole rule
    if (decl.prev() === undefined && decl.next() === undefined) {
      origRule.remove()
    } else {
      // Otherwise just remove the delcl
      decl.remove()
    }
  })
})
