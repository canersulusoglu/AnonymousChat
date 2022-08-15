import path from "path"
import { loadFilesSync } from "@graphql-tools/load-files"
import { mergeResolvers } from "@graphql-tools/merge"

const resolversArray = loadFilesSync(path.join(__dirname), {
    extensions: ['resolver.js', 'resolver.ts'],
    extractExports: fileExport => {
      if (typeof fileExport === 'function') {
        return fileExport('query_root')
      }
      return fileExport
    }
})

export default mergeResolvers(resolversArray);