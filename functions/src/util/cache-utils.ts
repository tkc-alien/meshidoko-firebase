/**
 * キャッシュファイル名を取得する
 * @param { string } cacheId
 * @return { string }
 */
export function filename(cacheId: string): string {
  return `caches/${cacheId}.json`;
}
