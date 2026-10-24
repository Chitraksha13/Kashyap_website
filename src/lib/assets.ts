// Every image under src/assets is picked up at build time. Folders map to sections:
//   about/  photos/  experience/<id>/  projects/<id>/
const all = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export function imagesIn(folder: string): string[] {
  const prefix = `../assets/${folder}/`
  return Object.keys(all)
    .filter((key) => key.startsWith(prefix) && !key.slice(prefix.length).includes('/'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((key) => all[key])
}
