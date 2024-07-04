import { PluginItem } from "@babel/core";

export function removeDataTestIdBabelPlugin (): PluginItem {
  return {
    visitor: {
      Program(path, state) {
        const forbiddenProps: any[] = state.opts.props || [];
        path.traverse({
          JSXIdentifier(current) {
            const nodeName = current.node.name;
            if (forbiddenProps.includes(nodeName)) {
              current.parentPath.remove();
            }
          }
        });
      }
    }
  }
}