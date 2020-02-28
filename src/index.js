import postcss from 'postcss'
import { map, join } from '@dword-design/functions'

export default postcss.plugin('postcss-link-area', () => {
  return css => {
    css.walkDecls('link-area', decl => {

      if (decl.value !== 'stretch') {
        return
      }

      const origRule = decl.parent

      const ruleSelectors = origRule.selectors
        |> map(ruleSelector => `${ruleSelector}:after`)
        |> join(',\n')

      // Insert the :after rule before the original rule
      const newRule = origRule.cloneAfter({ selector: ruleSelectors }).removeAll()

      newRule.append(
        { prop: 'content', value: '\'\'', source: decl.source },
        { prop: 'position', value: 'absolute', source: decl.source },
        { prop: 'top', value: 0, source: decl.source },
        { prop: 'right', value: 0, source: decl.source },
        { prop: 'bottom', value: 0, source: decl.source },
        { prop: 'left', value: 0, source: decl.source },
        { prop: 'z-index', value: 1, source: decl.source },
        { prop: 'pointer-events', value: 'auto', source: decl.source },
        { prop: 'background-color', value: 'rgba(0,0,0,0)', source: decl.source },
      )

      // If the original rule only had clear:fix in it, remove the whole rule
      if (decl.prev() === undefined && decl.next() === undefined) {
        origRule.remove()
      } else {
        // Otherwise just remove the delcl
        decl.remove()
      }
    })
  }
})