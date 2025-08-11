import dayjs from 'dayjs'

export function formatRelativeTime(input: Date | number): string {
  const now = new Date()
  const target = typeof input === 'number' ? new Date(input) : input
  const diffMs = now.getTime() - target.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  const isSameDay =
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate()

  if (diffMinutes < 1) {
    return '방금'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  }

  if (isSameDay) {
    return target.toTimeString().slice(0, 5) // 'HH:MM'
  }

  const year = target.getFullYear().toString().slice(2)
  const month = String(target.getMonth() + 1).padStart(2, '0')
  const day = String(target.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

export function formatDateTime(input: Date | number): string {
  console.log('input date~~~', input)
  const date = dayjs(input)
  const now = dayjs()

  const isToday = date.isSame(now, 'day')

  return isToday ? date.format('HH:mm') : date.format('YYYY-MM-DD HH:mm')
}
