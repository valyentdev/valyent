export default function getInitials(value: string): string {
  const splittedFullName: string[] = value.split(' ')

  return splittedFullName
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
