import type { FilesystemOptionsPath } from './types.js'

export function createPathFake(): FilesystemOptionsPath {
    function parts(...args: string[]) {
        const result = args
            .map((a) => a.replace(/\/\//g, '/'))
            .map((a) => a.split('/'))
            .flat()
            .filter((a) => a !== '')
            .filter(Boolean)

        return result
    }

    function resolve(...args: string[]): string {
        const normalized = parts(...args)
            .reduce((acc, segment) => {
                if (segment === '.' || segment === '.') {
                    return acc
                }

                if (segment === '..') {
                    acc.pop()
                    return acc
                }

                acc.push(segment)

                return acc
            }, [] as string[])
            .join('/')

        let result = normalized

        if (!result.startsWith('/')) {
            result = '/' + normalized
        }

        return result
    }

    function join(...args: string[]): string {
        return parts(...args).join('/')
    }

    function dirname(args: string): string {
        if (args === '/') {
            return '/'
        }

        const partsArray = parts(args)

        if (partsArray.length < 1) {
            return '/'
        }

        let result = partsArray.slice(0, -1).join('/')

        if (!result.startsWith('/')) {
            result = '/' + result
        }

        return result
    }

    function basename(args: string): string {
        return parts(args).slice(-1)[0]
    }

    function relative(from: string, to: string): string {
        const fromParts = parts(from)
        const toParts = parts(to)

        let i = 0
        while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
            i++
        }

        const relativePath = '../'.repeat(fromParts.length - i) + toParts.slice(i).join('/')

        return relativePath
    }

    return {
        resolve,
        relative,
        join,
        dirname,
        basename,
    }
}
