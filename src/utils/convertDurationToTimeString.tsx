export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(duration % 3600 / 60);
    const seconds = duration % 60

    const timeString = [hours, minutes, seconds]
          // Vai converter as unidades para String
          .map(unit => String(unit).padStart(2,'0'))
          // Join para unir
          .join(':')

    return timeString;      
}